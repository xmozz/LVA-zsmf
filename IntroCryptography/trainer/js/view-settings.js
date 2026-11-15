/* Settings & data: theme, content report, export / import / reset */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc;

  TA.views.settings = {
    mount: function (el) {
      function render() {
        var rep = TA.loadReport || { files: [], failed: [] };
        var counts = {};
        TA.bank.items.forEach(function (it) { counts[it.type] = (counts[it.type] || 0) + 1; });
        var html = '<section class="card-plain"><h1>Settings &amp; data</h1>' +
          '<h2>Theme</h2><div class="actions"><button class="btn" data-theme="system">Follow system</button><button class="btn" data-theme="light">Light</button><button class="btn" data-theme="dark">Dark</button></div>' +
          '<h2>Progress</h2><p class="dim">Stored in this browser under <code>localStorage["' + esc(TS.KEY) + '"]</code>. Export it to keep a backup or move to another browser.</p>' +
          '<div class="actions"><button class="btn" id="exp">Export progress (JSON)</button><label class="btn">Import progress…<input type="file" id="imp" accept=".json,application/json" hidden></label>' +
          (TS.state.mockActive ? '<button class="btn" id="dropmock">Discard running mock</button>' : '') +
          '<button class="btn btn-bad" id="reset">Reset progress</button></div><p id="msg" class="small"></p></section>';

        html += '<section class="card-plain"><h2>Content</h2><p>' + TA.bank.items.length + ' items loaded: ' +
          TB.TYPES.map(function (t) { return (counts[t] || 0) + ' ' + TB.TYPE_LABELS[t].toLowerCase(); }).join(', ') + '. Maths renderer: ' +
          (TR.hasKatex() ? 'KaTeX ' + esc(global.katex.version || '') : '<strong>unavailable</strong> (raw LaTeX shown)') + '.</p>' +
          '<div class="table-wrap"><table class="list compact"><thead><tr><th>File</th><th>Status</th><th class="num">Items</th></tr></thead><tbody>' +
          rep.files.map(function (f) {
            return '<tr><td><code>data/' + esc(f.name) + '</code></td><td>' + esc(f.status) + (f.errors.length ? ': ' + esc(f.errors.join('; ')) : '') + '</td><td class="num">' + f.items + '</td></tr>';
          }).join('') + '</tbody></table></div>';
        if (TA.bank.skipped.length) {
          html += '<h3>Skipped items</h3><ul class="small">' + TA.bank.skipped.map(function (s) {
            return '<li><code>' + esc(s.id) + '</code>' + (s.file ? ' (' + esc(s.file) + ')' : '') + ': ' + esc(s.reasons.join('; ')) + '</li>';
          }).join('') + '</ul>';
        }
        if (TA.bank.duplicates.length) {
          html += '<h3>Duplicate ids (later copies ignored)</h3><ul class="small">' + TA.bank.duplicates.map(function (s) {
            return '<li><code>' + esc(s.id) + '</code>' + (s.file ? ' (' + esc(s.file) + ')' : '') + '</li>';
          }).join('') + '</ul>';
        }
        html += '<p class="small dim">Full content validation: open <a href="selftest.html">selftest.html</a>.</p></section>';
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
          a.download = 'introcrypto-progress-' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '.json';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        };
        TA.qs('#imp', el).onchange = function () {
          var f = this.files && this.files[0];
          if (!f) return;
          var rd = new FileReader();
          rd.onload = function () {
            try {
              if (!global.confirm('Replace your current progress with the imported file?')) return;
              TS.importJSON(String(rd.result));
              TA.applyTheme();
              render();
              TA.qs('#msg', el).textContent = 'Progress imported.';
            } catch (e) { TA.qs('#msg', el).textContent = 'Import failed: ' + e.message; }
          };
          rd.readAsText(f);
        };
        var dm = TA.qs('#dropmock', el);
        if (dm) dm.onclick = function () {
          if (!global.confirm('Discard the running mock midterm without saving a result?')) return;
          TS.state.mockActive = null; TS.save(); render();
        };
        TA.qs('#reset', el).onclick = function () {
          if (!global.confirm('Reset ALL progress (answers, notes read, problems, mock results)? This cannot be undone. Consider exporting first.')) return;
          TS.reset();
          render();
          TA.qs('#msg', el).textContent = 'Progress reset.';
        };
      }
      render();
      return {};
    }
  };
})(window);
