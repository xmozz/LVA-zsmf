/* Settings & data: theme, content report, export / import / reset */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc, T = TA.t;

  TA.views.settings = {
    mount: function (el) {
      function render() {
        var rep = TA.loadReport || { files: [], failed: [] };
        var counts = {};
        TA.bank.items.forEach(function (it) { counts[it.type] = (counts[it.type] || 0) + 1; });
        var breakdown = TB.TYPES.map(function (t) { return (counts[t] || 0) + ' ' + TA.typeLabel(t).toLowerCase(); }).join(', ');
        var html = '<section class="card-plain"><h1>' + T('settings_title') + '</h1>' +
          '<h2>' + esc(T('settings_theme')) + '</h2><div class="actions"><button class="btn" data-theme="system">' + esc(T('settings_follow_system')) + '</button><button class="btn" data-theme="light">' + esc(T('theme_light')) + '</button><button class="btn" data-theme="dark">' + esc(T('theme_dark')) + '</button></div>' +
          '<h2>' + esc(T('settings_progress')) + '</h2><p class="dim">' + T('settings_storage', { key: esc(TS.KEY) }) + '</p>' +
          '<div class="actions"><button class="btn" id="exp">' + esc(T('settings_export')) + '</button><label class="btn">' + esc(T('settings_import')) + '<input type="file" id="imp" accept=".json,application/json" hidden></label>' +
          (TS.state.mockActive ? '<button class="btn" id="dropmock">' + esc(T('settings_discard_mock')) + '</button>' : '') +
          '<button class="btn btn-bad" id="reset">' + esc(T('settings_reset')) + '</button></div><p id="msg" class="small"></p></section>';

        html += '<section class="card-plain"><h2>' + esc(T('settings_content')) + '</h2><p>' + T('settings_items_loaded', { n: TA.bank.items.length, breakdown: esc(breakdown) }) + ' ' +
          T('settings_maths', { renderer: TR.hasKatex() ? 'KaTeX ' + esc(global.katex.version || '') : T('settings_unavailable') }) + '</p>' +
          '<div class="table-wrap"><table class="list compact"><thead><tr><th>' + esc(T('table_file')) + '</th><th>' + esc(T('table_status')) + '</th><th class="num">' + esc(T('table_items')) + '</th></tr></thead><tbody>' +
          rep.files.map(function (f) {
            return '<tr><td><code>data/' + esc(f.name) + '</code></td><td>' + esc(f.status) + (f.errors.length ? ': ' + esc(f.errors.join('; ')) : '') + '</td><td class="num">' + f.items + '</td></tr>';
          }).join('') + '</tbody></table></div>';
        if (TA.bank.skipped.length) {
          html += '<h3>' + esc(T('settings_skipped')) + '</h3><ul class="small">' + TA.bank.skipped.map(function (s) {
            return '<li><code>' + esc(s.id) + '</code>' + (s.file ? ' (' + esc(s.file) + ')' : '') + ': ' + esc(s.reasons.join('; ')) + '</li>';
          }).join('') + '</ul>';
        }
        if (TA.bank.duplicates.length) {
          html += '<h3>' + esc(T('settings_duplicates')) + '</h3><ul class="small">' + TA.bank.duplicates.map(function (s) {
            return '<li><code>' + esc(s.id) + '</code>' + (s.file ? ' (' + esc(s.file) + ')' : '') + '</li>';
          }).join('') + '</ul>';
        }
        html += '<p class="small dim">' + T('settings_selftest') + '</p></section>';
        el.innerHTML = html;

        TA.qsa('[data-theme]', el).forEach(function (b) {
          b.classList.toggle('btn-primary', TS.state.settings.theme === b.getAttribute('data-theme'));
          b.onclick = function () { TS.state.settings.theme = b.getAttribute('data-theme'); TS.save(); TA.applyTheme(); render(); };
        });
        TA.qs('#exp', el).onclick = function () {
          var blob = new Blob([TS.exportJSON()], { type: 'application/json' });
          var a = document.createElement('a');
          var d = new Date();
          a.href = URL.createObjectURL(blob);
          a.download = String((global.COURSE && global.COURSE.id) || 'trainer') + '-progress-' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '.json';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        };
        TA.qs('#imp', el).onchange = function () {
          var f = this.files && this.files[0];
          if (!f) return;
          var rd = new FileReader();
          rd.onload = function () {
            try {
              if (!global.confirm(T('settings_import_confirm'))) return;
              TS.importJSON(String(rd.result));
              TA.applyTheme();
              render();
              TA.qs('#msg', el).textContent = T('settings_imported');
            } catch (e) { TA.qs('#msg', el).textContent = T('settings_import_failed', { message: e.message }); }
          };
          rd.readAsText(f);
        };
        var dm = TA.qs('#dropmock', el);
        if (dm) dm.onclick = function () {
          if (!global.confirm(T('mock_discard_confirm'))) return;
          TS.state.mockActive = null; TS.save(); render();
        };
        TA.qs('#reset', el).onclick = function () {
          if (!global.confirm(T('settings_reset_confirm'))) return;
          TS.reset();
          render();
          TA.qs('#msg', el).textContent = T('settings_reset_done');
        };
      }
      render();
      return {};
    }
  };
})(window);
