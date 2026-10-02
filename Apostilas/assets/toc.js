/* Sumário no topo da página — expansível, com busca.
   Nível 1 = h1 (aulas); ao clicar em ▸ mostra os h2/h3 daquela aula.
   Os filhos só são montados ao expandir (o documento tem ~46 mil títulos).
   O CSS está embutido aqui, então não depende do style.css. */
(function () {
  'use strict';

  var MAX_RESULTS = 150;

  /* ---------- CSS embutido ---------- */
  var css = [
    '.toc{margin:0 0 2.5rem;background:var(--bg-soft,#1b1e26);border:1px solid var(--line,#2f3442);border-radius:10px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:.92rem;line-height:1.4;color:var(--text,#d9dbe1)}',
    '.toc *{box-sizing:border-box}',
    '.toc>summary{cursor:pointer;padding:.85rem 1.1rem;font-weight:650;font-size:1.05rem;color:var(--h1,#c9b8ff);list-style:none;user-select:none}',
    '.toc>summary::-webkit-details-marker{display:none}',
    '.toc>summary::before{content:"▸";display:inline-block;width:1.2em;color:var(--h2,#a9d6f5)}',
    '.toc[open]>summary::before{content:"▾"}',
    '.toc-count-total{font-weight:400;font-size:.8rem;color:var(--text-dim,#9aa0ae);margin-left:.5rem}',
    '.toc-body{padding:0 1rem 1rem}',
    '.toc-search{width:100%;margin:0 0 .7rem;padding:.6em .85em;font:inherit;color:inherit;background:var(--bg,#14161c);border:1px solid var(--line,#2f3442);border-radius:8px}',
    '.toc-search:focus{outline:2px solid var(--h2,#a9d6f5);outline-offset:1px}',
    '.toc-scroll{position:relative;max-height:min(65vh,36rem);overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}',
    '.toc ul{list-style:none;margin:0;padding:0}',
    '.toc li{margin:0;padding:0;text-align:left;hyphens:manual}',
    '.toc .toc-sub{padding-left:1.5rem;margin:0 0 .3rem}',
    '.toc-item{position:relative}',
    '.toc-toggle{position:absolute;left:0;top:.15rem;width:1.5rem;height:1.7rem;padding:0;background:none;border:0;color:var(--h2,#a9d6f5);cursor:pointer;font-size:.9rem}',
    '.toc-toggle-empty{pointer-events:none}',
    '.toc-item>.toc-link{margin-left:1.5rem}',
    '.toc-sub .toc-item>.toc-link{margin-left:0}',
    '.toc-link{display:block;padding:.3em .5em;border-radius:6px;text-decoration:none;text-align:left;color:var(--text,#d9dbe1)}',
    '.toc-link:hover{background:var(--bg-raise,#232732);color:var(--text-bold,#f2f3f7)}',
    '.toc-l1{color:var(--h1,#c9b8ff);font-weight:600}',
    '.toc-l2{color:var(--h2,#a9d6f5)}',
    '.toc-l3{color:var(--h3,#b4e7cf);font-size:.93em}',
    '.toc-link.is-current{background:rgba(201,184,255,.16);box-shadow:inset 3px 0 0 var(--h1,#c9b8ff)}',
    '.toc-info{margin:0 0 .5rem;color:var(--text-dim,#9aa0ae);text-align:left;hyphens:manual}',
    '.toc-result{padding:.1rem 0}',
    '.toc-ctx{display:block;padding:0 .5em;font-size:.78em;color:var(--text-dim,#9aa0ae)}',
    'h1.toc-flash,h2.toc-flash,h3.toc-flash{animation:toc-flash 1.6s ease-out}',
    '@keyframes toc-flash{0%{background:rgba(201,184,255,.3)}100%{background:transparent}}',
    '@media print{.toc{display:none}}'
  ].join('\n');
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- Utilidades ---------- */
  function clean(s) { return s.replace(/\s+/g, ' ').trim(); }
  function norm(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* ---------- 1. Indexar títulos ---------- */
  var heads = [], groups = [], cur = null;

  document.querySelectorAll('h1, h2, h3').forEach(function (h) {
    if (!h.id) return;
    var lvl = +h.tagName.charAt(1);
    var item = { id: h.id, text: clean(h.textContent), lvl: lvl, el: h };
    if (lvl === 1) {
      cur = { head: item, kids: [] };
      item.group = cur;
      groups.push(cur);
    } else if (cur) {
      item.group = cur;
      cur.kids.push(item);
    } else {
      return;
    }
    heads.push(item);
  });
  if (!groups.length) return;

  /* ---------- 2. Montar o sumário (no topo do body) ---------- */
  var toc = el('details', 'toc');
  var summary = el('summary');
  summary.appendChild(document.createTextNode('Sumário'));
  var total = el('span', 'toc-count-total');
  total.textContent = groups.length + ' seções';
  summary.appendChild(total);

  var body = el('div', 'toc-body');
  var search = el('input', 'toc-search', {
    type: 'search', placeholder: 'Buscar título…',
    'aria-label': 'Buscar nos títulos', autocomplete: 'off'
  });
  var scroll = el('div', 'toc-scroll');
  var list = el('ul', 'toc-list');
  var results = el('div', 'toc-results'); results.hidden = true;
  scroll.appendChild(list); scroll.appendChild(results);
  body.appendChild(search); body.appendChild(scroll);
  toc.appendChild(summary); toc.appendChild(body);
  document.body.insertBefore(toc, document.body.firstChild);

  function link(item) {
    var a = el('a', 'toc-link toc-l' + item.lvl, { href: '#' + item.id });
    a.textContent = item.text;
    a.dataset.id = item.id;
    return a;
  }

  var frag = document.createDocumentFragment();
  groups.forEach(function (g) {
    var li = el('li', 'toc-item');
    g.li = li; li._group = g;
    if (g.kids.length) {
      var t = el('button', 'toc-toggle', { type: 'button', 'aria-expanded': 'false', 'aria-label': 'Expandir seção' });
      t.textContent = '▸';
      li.appendChild(t);
    } else {
      li.appendChild(el('span', 'toc-toggle toc-toggle-empty'));
    }
    li.appendChild(link(g.head));
    frag.appendChild(li);
  });
  list.appendChild(frag);

  function setExpanded(g, open) {
    var t = g.li.querySelector('.toc-toggle');
    if (!t || t.classList.contains('toc-toggle-empty')) return;
    if (open && !g.ul) {
      g.ul = el('ul', 'toc-sub');
      var f = document.createDocumentFragment();
      g.kids.forEach(function (k) {
        var li = el('li', 'toc-item');
        li.appendChild(link(k));
        f.appendChild(li);
      });
      g.ul.appendChild(f);
      g.li.appendChild(g.ul);
    }
    if (g.ul) g.ul.hidden = !open;
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
    t.textContent = open ? '▾' : '▸';
    g.li.classList.toggle('is-open', open);
  }

  /* ---------- 3. Cliques ---------- */
  function goTo(id) {
    var target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
    if (history.pushState) history.pushState(null, '', '#' + encodeURIComponent(id));
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.classList.remove('toc-flash'); void target.offsetWidth;
    target.classList.add('toc-flash');
  }

  toc.addEventListener('click', function (e) {
    var t = e.target.closest('.toc-toggle');
    if (t && !t.classList.contains('toc-toggle-empty')) {
      var g = t.parentNode._group;
      setExpanded(g, !g.li.classList.contains('is-open'));
      return;
    }
    var a = e.target.closest('a.toc-link');
    if (a) { e.preventDefault(); goTo(a.dataset.id); }
  });

  /* ---------- 4. Ao abrir, mostrar onde você está ---------- */
  var activeLink = null;

  function currentGroupIndex() {
    var lo = 0, hi = groups.length - 1, ans = 0;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (groups[mid].head.el.getBoundingClientRect().top <= 80) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }

  toc.addEventListener('toggle', function () {
    if (!toc.open || !results.hidden) return;
    // só marca a posição se você já rolou além do sumário
    if (toc.getBoundingClientRect().bottom > 0) return;
    var g = groups[currentGroupIndex()];
    setExpanded(g, true);
    var h = g.head;
    for (var i = 0; i < g.kids.length; i++) {
      if (g.kids[i].el.getBoundingClientRect().top <= 80) h = g.kids[i]; else break;
    }
    if (activeLink) activeLink.classList.remove('is-current');
    activeLink = g.li.querySelector('a[data-id="' + (window.CSS && CSS.escape ? CSS.escape(h.id) : h.id) + '"]');
    if (activeLink) {
      activeLink.classList.add('is-current');
      var box = scroll.getBoundingClientRect(), ar = activeLink.getBoundingClientRect();
      scroll.scrollTop += (ar.top - box.top) - scroll.clientHeight / 2;
    }
  });

  /* ---------- 5. Busca ---------- */
  var timer = null;
  search.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(runSearch, 150);
  });

  function runSearch() {
    var q = norm(search.value.trim());
    results.textContent = '';
    if (q.length < 2) { results.hidden = true; list.hidden = false; return; }
    var words = q.split(/\s+/), found = 0, shown = 0;
    var f = document.createDocumentFragment();

    for (var i = 0; i < heads.length; i++) {
      var h = heads[i];
      if (h.n === undefined) h.n = norm(h.text);
      var ok = true;
      for (var w = 0; w < words.length; w++) {
        if (h.n.indexOf(words[w]) === -1) { ok = false; break; }
      }
      if (!ok) continue;
      found++;
      if (shown < MAX_RESULTS) {
        var row = el('div', 'toc-result');
        row.appendChild(link(h));
        if (h.lvl > 1) {
          var ctx = el('span', 'toc-ctx'); ctx.textContent = h.group.head.text;
          row.appendChild(ctx);
        }
        f.appendChild(row);
        shown++;
      }
    }

    var info = el('p', 'toc-info');
    info.textContent = found
      ? (found > shown ? shown + ' de ' + found + ' resultados — refine a busca'
                       : found + (found === 1 ? ' resultado' : ' resultados'))
      : 'Nenhum título encontrado';
    results.appendChild(info);
    results.appendChild(f);
    list.hidden = true; results.hidden = false;
    scroll.scrollTop = 0;
  }

  /* ---------- 6. Abrir direto num #hash ---------- */
  if (location.hash.length > 1) {
    var id = decodeURIComponent(location.hash.slice(1));
    window.addEventListener('load', function () {
      var t = document.getElementById(id);
      if (t) t.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  }
})();
