/* Blueprint engine: which items fill which mock-exam section.
 * The course configuration owns the blueprint; this file only interprets it.
 * window.BP
 */
(function (global) {
  'use strict';

  var TA = global.TA;

  function arr(v) { return Array.isArray(v) ? v : (v == null ? null : [v]); }
  function itemPoints(it) { return it.type === 'problem' ? (it.total || 0) : (it.points || 0); }
  function inRange(v, pair) {
    if (!pair) return true;
    var a = arr(pair);
    return v >= a[0] && v <= a[a.length - 1];
  }

  function matchFilters(it, f) {
    if (!f) return true;
    var topics = arr(f.topics);
    if (topics && topics.indexOf(global.TB.topicKey(it.topic)) < 0) return false;
    var units = arr(f.units || f.lectures);
    if (units && units.map(String).indexOf(String(it.lecture)) < 0) return false;
    var origins = arr(f.origins);
    if (origins && origins.indexOf(it.origin) < 0) return false;
    var diff = arr(f.difficulty);
    if (diff && diff.map(Number).indexOf(Number(it.difficulty)) < 0) return false;
    if (f.points && !inRange(itemPoints(it), f.points)) return false;
    if (f.mock === true && !(it.type === 'problem' && it.mock === true)) return false;
    if (f.mock === false && it.mock === true) return false;
    return true;
  }

  function pool(sec, items) {
    return (items || []).filter(function (it) { return it.type === sec.type && matchFilters(it, sec.filters); });
  }

  function poolWithoutMock(sec, items) {
    var f = {};
    for (var k in sec.filters) if (Object.prototype.hasOwnProperty.call(sec.filters, k) && k !== 'mock') f[k] = sec.filters[k];
    var s2 = {};
    for (var k2 in sec) if (Object.prototype.hasOwnProperty.call(sec, k2)) s2[k2] = sec[k2];
    s2.filters = f;
    return pool(s2, items);
  }

  function priority(it, used) {
    var s = global.TS ? global.TS.stat(it.id) : null;
    var p = used && used[it.id] ? 40 : 0;
    if (!s) return p + 0;
    if (global.TA && global.TA.isMistake(it.id)) return p + 10;
    return p + 20;
  }

  /* Choose `count` items, optionally evenly across topics/units. */
  function pickCount(sec, list, used) {
    var n = sec.count || 0;
    if (!n || !list.length) return [];
    var key = sec.spread === 'unit' || sec.spread === 'lecture' ? 'lecture' : (sec.spread === 'topic' ? 'topic' : null);
    var cand = list.slice().sort(function (a, b) { return priority(a, used) - priority(b, used); });
    if (!key) return global.TA.shuffle(cand.slice(0, n));
    var groups = {};
    cand.forEach(function (it) {
      var k = key === 'topic' ? global.TB.topicKey(it.topic) : String(it.lecture);
      (groups[k] = groups[k] || []).push(it);
    });
    var keys = global.TA.shuffle(Object.keys(groups));
    var out = [];
    while (out.length < n && keys.some(function (k) { return groups[k].length; })) {
      keys.forEach(function (k) { if (out.length < n && groups[k].length) out.push(groups[k].shift()); });
    }
    return global.TA.shuffle(out);
  }

  function evaluate(sec, set, used) {
    var tot = 0, topics = {}, dup = 0, u = 0;
    set.forEach(function (p) {
      tot += itemPoints(p);
      var k = global.TB.topicKey(p.topic);
      if (topics[k]) dup++;
      topics[k] = 1;
      if (used && used[p.id]) u += Math.min(3, used[p.id]);
    });
    var target = sec.pointsTarget;
    var min = sec.pointsMin != null ? sec.pointsMin : (target != null ? target * 0.85 : null);
    var max = sec.pointsMax != null ? sec.pointsMax : (target != null ? target * 1.15 : null);
    var cost = 0;
    if (target != null) {
      cost += Math.abs(tot - target) * 3;
      if (min != null && max != null && (tot < min || tot > max)) cost += 100 + Math.abs(tot - target) * 10;
    }
    if (sec.countTarget) cost += Math.abs(set.length - sec.countTarget) * 2;
    cost += dup * 4 + u * 3 + Math.random() * 2.5;
    return { cost: cost, total: tot };
  }

  /* Choose a subset of problems (or other point-bearing items) for a section. */
  function pickPoints(sec, list, used) {
    if (!list.length) return [];
    var target = sec.pointsTarget;
    var max = sec.pointsMax != null ? sec.pointsMax : (target != null ? target * 1.15 : Infinity);
    var maxK = Math.min(sec.countMax || 5, list.length);
    var cand = list.slice().sort(function (a, b) { return priority(a, used) - priority(b, used); }).slice(0, 40);
    var best = null, bestCost = Infinity;
    var n = cand.length;
    (function rec(start, set, tot) {
      if (set.length >= 1) {
        var ev = evaluate(sec, set, used);
        if (ev.cost < bestCost) { bestCost = ev.cost; best = set.slice(); }
      }
      if (set.length >= maxK || tot >= max) return;
      for (var i = start; i < n; i++) {
        set.push(cand[i]);
        rec(i + 1, set, tot + itemPoints(cand[i]));
        set.pop();
      }
    })(0, [], 0);
    return best || [];
  }

  /* Public: {items, max, warnings:[{key,vars}]} */
  function pick(sec, items, used) {
    used = used || {};
    var warnings = [];
    var list = pool(sec, items);
    if (!list.length && sec.filters && sec.filters.mock === true) {
      list = poolWithoutMock(sec, items);
      if (list.length) warnings.push({ key: 'mock_section_fallback', vars: { label: sec.label } });
    }
    var picked;
    if (sec.count) {
      picked = pickCount(sec, list, used);
      if (picked.length < sec.count) {
        if (!picked.length) warnings.push({ key: 'mock_section_missing', vars: { label: sec.label, type: sec.type } });
        else warnings.push({ key: 'mock_section_short', vars: { have: picked.length, want: sec.count, type: sec.type, label: sec.label } });
      }
    } else {
      picked = pickPoints(sec, list, used);
      if (!picked.length) warnings.push({ key: 'mock_section_missing', vars: { label: sec.label, type: sec.type } });
      else {
        var tot = picked.reduce(function (a, it) { return a + itemPoints(it); }, 0);
        var min = sec.pointsMin != null ? sec.pointsMin : (sec.pointsTarget != null ? sec.pointsTarget * 0.85 : null);
        var max = sec.pointsMax != null ? sec.pointsMax : (sec.pointsTarget != null ? sec.pointsTarget * 1.15 : null);
        if (min != null && max != null && (tot < min || tot > max)) {
          warnings.push({ key: 'mock_section_points', vars: { type: sec.type, min: min, max: max, label: sec.label } });
        }
      }
    }
    return { items: picked, max: sectionMax(sec, picked), warnings: warnings };
  }

  function sectionMax(sec, picked) {
    var kind = (sec.scoring && sec.scoring.kind) || 'rubric';
    if (kind === 'plusminus') return picked.length * (sec.scoring.plus != null ? sec.scoring.plus : 1);
    if (kind === 'peritem') return picked.length * (sec.scoring.points != null ? sec.scoring.points : 1);
    if (kind === 'proportional') {
      var s = picked.reduce(function (a, it) { return a + (it.points || 0); }, 0);
      return s || ((sec.points || 0) * (sec.count || 0));
    }
    return picked.reduce(function (a, it) { return a + itemPoints(it); }, 0);
  }

  /* Deterministic feasibility check for the self-test. */
  function canFill(sec, items) {
    var list = pool(sec, items);
    if (!list.length && sec.filters && sec.filters.mock === true) list = poolWithoutMock(sec, items);
    if (sec.count) return list.length >= sec.count;
    if (!list.length) return false;
    list = list.slice(0, 40);
    var target = sec.pointsTarget;
    var min = sec.pointsMin != null ? sec.pointsMin : (target != null ? target * 0.85 : null);
    var max = sec.pointsMax != null ? sec.pointsMax : (target != null ? target * 1.15 : null);
    var maxK = Math.min(sec.countMax || 5, list.length);
    var seen = {};
    var ok = false;
    (function rec(start, k, tot) {
      if (ok) return;
      if (k >= 1 && (min == null || (tot >= min && (max == null || tot <= max)))) { ok = true; return; }
      if (k >= maxK || (max != null && tot >= max)) return;
      for (var i = start; i < list.length; i++) {
        var key = (k + 1) + '|' + (tot + itemPoints(list[i]));
        if (seen[key]) continue;
        seen[key] = 1;
        rec(i + 1, k + 1, tot + itemPoints(list[i]));
        if (ok) return;
      }
    })(0, 0, 0);
    return ok;
  }

  function report(items) {
    var bp = (global.COURSE && global.COURSE.blueprint) || { sections: [] };
    return (bp.sections || []).map(function (sec) {
      return {
        id: sec.id, label: sec.label, type: sec.type,
        ok: canFill(sec, items), pool: pool(sec, items).length
      };
    });
  }

  global.BP = {
    pool: pool,
    pick: pick,
    canFill: canFill,
    sectionMax: sectionMax,
    itemPoints: itemPoints,
    report: report
  };
})(window);
