/**
 * GitHub Commit Heatmap - 3D Isometric City View
 * Renders contribution data as a city of rising bars on an HTML5 Canvas.
 */
(function () {
  var root = document.getElementById('gh-heatmap');
  if (!root) return;

  // -- Iso tile dimensions --
  var TW     = 20;   // tile width  (full diamond width)
  var TH     = 10;   // tile height (TW / 2 for true iso)
  var MAX_H  = 80;   // tallest bar in logical px
  var PAD    = 24;   // canvas padding

  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // -- Shared state --
  var allData      = [];
  var selectedYear = null;
  var tooltip      = null;
  var cvs          = null;
  var ctx          = null;
  var bars         = [];
  var animId       = null;
  var animProg     = 0;
  var hoveredBar   = null;
  var logW         = 0;
  var logH         = 0;
  var DPR          = window.devicePixelRatio || 1;

  // =========================================================================
  // Bootstrap
  // =========================================================================
  async function init() {
    showLoading();
    try {
      var res  = await fetch('/api/github-heatmap');
      var json = await res.json();
      if (!json.ok || !json.data.length) throw new Error(json.error || 'No data');
      allData      = json.data;
      selectedYear = new Date(allData[allData.length - 1].date).getFullYear();
      render();
    } catch (err) {
      showError(err.message);
    }
  }

  // =========================================================================
  // Data helpers
  // =========================================================================
  function getYears() {
    return [...new Set(allData.map(function(d){ return d.date.slice(0,4); }))].sort();
  }

  function dataForYear(yr) {
    return allData.filter(function(d){ return d.date.startsWith(String(yr)); });
  }

  function totalCommits(data) {
    return data.reduce(function(s,d){ return s + d.count; }, 0);
  }

  function longestStreak(data) {
    var best = 0, cur = 0;
    data.forEach(function(d){ cur = d.count > 0 ? cur + 1 : 0; if (cur > best) best = cur; });
    return best;
  }

  function activeDays(data) {
    return data.filter(function(d){ return d.count > 0; }).length;
  }

  function buildGrid(data) {
    var map = {};
    data.forEach(function(d){ map[d.date] = d; });
    var first = new Date(data[0].date + 'T00:00:00');
    var last  = new Date(data[data.length - 1].date + 'T00:00:00');
    var start = new Date(first);
    start.setDate(start.getDate() - start.getDay());

    var grid = [], week = [], cur = new Date(start);
    while (cur <= last) {
      var iso   = cur.toISOString().slice(0, 10);
      var entry = map[iso] || { date: iso, level: 0, count: 0 };
      week.push(Object.assign({}, entry, { inRange: cur >= first && cur <= last }));
      if (week.length === 7) { grid.push(week); week = []; }
      cur.setDate(cur.getDate() + 1);
    }
    if (week.length) { while (week.length < 7) week.push(null); grid.push(week); }
    return grid;
  }

  // =========================================================================
  // Theme
  // =========================================================================
  function getTheme() {
    var dark = document.documentElement.getAttribute('data-theme') !== 'light';
    return dark ? {
      canvasBg : '#0d0d0f',
      levels   : [
        { top: '#1e1e22', lft: '#131316', rgt: '#191920' },
        { top: '#1b4a30', lft: '#0f2c1c', rgt: '#153a25' },
        { top: '#1e7a3a', lft: '#104821', rgt: '#17602e' },
        { top: '#28a845', lft: '#175f27', rgt: '#208537' },
        { top: '#3dd655', lft: '#227b30', rgt: '#30ab43' },
      ],
    } : {
      canvasBg : '#f2efe8',
      levels   : [
        { top: '#dddad3', lft: '#c5c2bc', rgt: '#d1cec8' },
        { top: '#9be9a8', lft: '#6ec87a', rgt: '#83d492' },
        { top: '#40c463', lft: '#2b9146', rgt: '#34a853' },
        { top: '#30a14e', lft: '#1d6731', rgt: '#277a3d' },
        { top: '#206d38', lft: '#134325', rgt: '#1a572e' },
      ],
    };
  }

  // =========================================================================
  // Main render (HTML shell + canvas)
  // =========================================================================
  function render() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    root.innerHTML = '';

    var yearData = dataForYear(selectedYear);
    var grid     = buildGrid(yearData);
    var maxCount = Math.max.apply(null, yearData.map(function(d){ return d.count; }).concat([1]));
    var total    = totalCommits(yearData);
    var streak   = longestStreak(yearData);
    var active   = activeDays(yearData);

    // -- Wrapper --
    var wrap = el('div', 'heatmap-wrap');

    // -- Header --
    var header = el('div', 'heatmap-header');
    var tg = el('div', 'heatmap-title-group');
    tg.appendChild(elTxt('p', 'section-label', 'Activity'));
    tg.appendChild(elTxt('h2', 'heatmap-title',
      total.toLocaleString() + ' contributions in ' + selectedYear));
    header.appendChild(tg);

    var years = getYears();
    if (years.length > 1) {
      var pills = el('div', 'heatmap-years');
      years.forEach(function(y) {
        var btn = el('button', 'heatmap-year-btn' + (y == selectedYear ? ' is-active' : ''));
        btn.textContent = y;
        btn.addEventListener('click', function(){ selectedYear = parseInt(y); render(); });
        pills.appendChild(btn);
      });
      header.appendChild(pills);
    }
    wrap.appendChild(header);

    // -- Stats --
    var stats = el('div', 'heatmap-stats');
    [
      { label: 'Total commits',  value: total.toLocaleString() },
      { label: 'Active days',    value: active },
      { label: 'Longest streak', value: streak + 'd' },
    ].forEach(function(s) {
      var sd = el('div', 'heatmap-stat');
      sd.appendChild(elTxt('span', 'heatmap-stat__value', String(s.value)));
      sd.appendChild(elTxt('span', 'heatmap-stat__label', s.label));
      stats.appendChild(sd);
    });
    wrap.appendChild(stats);

    // -- Canvas wrapper --
    var cWrap = el('div', 'heatmap-canvas-wrap');
    cvs = document.createElement('canvas');
    cvs.className = 'heatmap-canvas';
    cWrap.appendChild(cvs);
    wrap.appendChild(cWrap);

    // -- Legend --
    var legend = el('div', 'heatmap-legend');
    legend.appendChild(elTxt('span', 'heatmap-legend__label', 'Less'));
    [0,1,2,3,4].forEach(function(lv){
      var c = el('div', 'heatmap-cell heatmap-legend__cell');
      c.dataset.level = lv;
      legend.appendChild(c);
    });
    legend.appendChild(elTxt('span', 'heatmap-legend__label', 'More'));
    wrap.appendChild(legend);

    root.appendChild(wrap);

    // -- Tooltip singleton --
    tooltip = document.getElementById('heatmap-tooltip');
    if (!tooltip) {
      tooltip = el('div', 'heatmap-tooltip');
      tooltip.id = 'heatmap-tooltip';
      tooltip.hidden = true;
      document.body.appendChild(tooltip);
    }

    // -- Build bars & start canvas --
    bars = computeBars(grid, maxCount);
    setupCanvas(cWrap);
    startAnim();
  }

  // =========================================================================
  // Bar geometry
  // =========================================================================
  function computeBars(grid, maxCount) {
    var cols = grid.length;
    var rows = 7;
    var originX = rows * (TW / 2) + PAD;
    var originY = MAX_H + PAD + TH;

    var list = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var day = grid[c] ? grid[c][r] : null;
        if (!day || !day.inRange) continue;
        var lv  = Math.min(day.level || 0, 4);
        var cnt = day.count || 0;
        var bh  = cnt > 0 ? Math.max(5, (cnt / maxCount) * MAX_H) : 2;
        var cx  = originX + (c - r) * (TW / 2);
        var cy  = originY + (c + r) * (TH / 2);
        list.push({ c: c, r: r, cx: cx, cy: cy, bh: bh, level: lv, count: cnt, date: day.date });
      }
    }
    // Painter's order: back to front
    list.sort(function(a, b){ return (a.c + a.r) - (b.c + b.r); });
    return list;
  }

  // =========================================================================
  // Canvas sizing
  // =========================================================================
  function setupCanvas(wrapper) {
    DPR = window.devicePixelRatio || 1;
    var cols = Math.max.apply(null, bars.map(function(b){ return b.c; })) + 1;
    var rows = 7;

    logW = rows * (TW / 2) + PAD * 2 + cols * (TW / 2) + TW;
    logH = (cols + rows) * (TH / 2) + MAX_H + PAD * 3;

    // Scale to fit container
    var containerW = wrapper.clientWidth || 900;
    var scale = Math.min(1, containerW / logW);
    var cssW  = Math.round(logW * scale);
    var cssH  = Math.round(logH * scale);

    cvs.style.width  = cssW + 'px';
    cvs.style.height = cssH + 'px';
    cvs.width  = Math.round(logW * DPR);
    cvs.height = Math.round(logH * DPR);

    ctx = cvs.getContext('2d');
    ctx.scale(DPR, DPR);

    // Events
    cvs.addEventListener('mousemove', onMouseMove);
    cvs.addEventListener('mouseleave', onMouseLeave);
  }

  // =========================================================================
  // Animation
  // =========================================================================
  function startAnim() {
    animProg = 0;
    var FRAMES = 50;
    function tick() {
      animProg = Math.min(animProg + 1, FRAMES);
      redraw(easeOut(animProg / FRAMES));
      if (animProg < FRAMES) animId = requestAnimationFrame(tick);
      else animId = null;
    }
    animId = requestAnimationFrame(tick);
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  // =========================================================================
  // Draw
  // =========================================================================
  function redraw(t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, logW, logH);
    var theme = getTheme();

    bars.forEach(function(bar) {
      var bh  = bar.bh * t;
      var pal = theme.levels[bar.level];
      var hot = bar === hoveredBar;

      var topC = hot ? brighten(pal.top, 0.18) : pal.top;
      var lftC = hot ? brighten(pal.lft, 0.18) : pal.lft;
      var rgtC = hot ? brighten(pal.rgt, 0.18) : pal.rgt;

      drawBar(bar.cx, bar.cy, bh, topC, lftC, rgtC, hot);
    });
  }

  function drawBar(cx, cy, bh, topC, lftC, rgtC, hovered) {
    var hw = TW / 2;
    var hh = TH / 2;

    // Top face (diamond)
    ctx.beginPath();
    ctx.moveTo(cx,      cy - bh - hh);   // top vertex
    ctx.lineTo(cx + hw, cy - bh);         // right vertex
    ctx.lineTo(cx,      cy - bh + hh);   // bottom vertex
    ctx.lineTo(cx - hw, cy - bh);         // left vertex
    ctx.closePath();
    ctx.fillStyle = topC;
    ctx.fill();
    if (hovered) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Left face
    ctx.beginPath();
    ctx.moveTo(cx - hw, cy - bh);         // top-left
    ctx.lineTo(cx,      cy - bh + hh);   // top-right
    ctx.lineTo(cx,      cy + hh);          // bottom-right
    ctx.lineTo(cx - hw, cy);               // bottom-left
    ctx.closePath();
    ctx.fillStyle = lftC;
    ctx.fill();

    // Right face
    ctx.beginPath();
    ctx.moveTo(cx,      cy - bh + hh);   // top-left
    ctx.lineTo(cx + hw, cy - bh);         // top-right
    ctx.lineTo(cx + hw, cy);               // bottom-right
    ctx.lineTo(cx,      cy + hh);          // bottom-left
    ctx.closePath();
    ctx.fillStyle = rgtC;
    ctx.fill();
  }

  // =========================================================================
  // Hover
  // =========================================================================
  function onMouseMove(e) {
    var rect  = cvs.getBoundingClientRect();
    var sx    = logW / rect.width;
    var sy    = logH / rect.height;
    var mx    = (e.clientX - rect.left) * sx;
    var my    = (e.clientY - rect.top)  * sy;

    var hit = null;
    for (var i = bars.length - 1; i >= 0; i--) {
      if (hitTest(mx, my, bars[i])) { hit = bars[i]; break; }
    }

    var prev = hoveredBar;
    hoveredBar = hit;

    if (hit) {
      tooltip.innerHTML =
        '<strong>' + hit.count + ' contribution' + (hit.count !== 1 ? 's' : '') + '</strong>' +
        '<span>' + fmtDate(hit.date) + '</span>';
      tooltip.hidden = false;
      positionTip(e);
    } else {
      tooltip.hidden = true;
    }

    if (hit !== prev && !animId) redraw(1);
  }

  function onMouseLeave() {
    hoveredBar = null;
    if (tooltip) tooltip.hidden = true;
    if (!animId) redraw(1);
  }

  function hitTest(mx, my, bar) {
    var hw = TW / 2;
    var hh = TH / 2;
    return mx > bar.cx - hw && mx < bar.cx + hw &&
           my > bar.cy - bar.bh - hh && my < bar.cy + hh;
  }

  // Reposition tooltip on mousemove
  document.addEventListener('mousemove', function(e) {
    if (tooltip && !tooltip.hidden) positionTip(e);
  });

  function positionTip(e) {
    var tw = tooltip.offsetWidth  || 140;
    var th = tooltip.offsetHeight || 44;
    var m  = 12;
    var l  = e.clientX - tw / 2;
    var t  = e.clientY - th - m;
    if (l < m) l = m;
    if (l + tw > window.innerWidth - m) l = window.innerWidth - tw - m;
    if (t < m) t = e.clientY + m;
    tooltip.style.left = l + 'px';
    tooltip.style.top  = t + 'px';
  }

  // =========================================================================
  // Theme switch: re-draw canvas when theme toggles
  // =========================================================================
  new MutationObserver(function() {
    if (!animId && bars.length) redraw(1);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // =========================================================================
  // Utilities
  // =========================================================================
  function brighten(hex, amt) {
    var r = parseInt(hex.slice(1,3), 16);
    var g = parseInt(hex.slice(3,5), 16);
    var b = parseInt(hex.slice(5,7), 16);
    var c = function(v){ return Math.min(255, Math.round(v + 255 * amt)); };
    return 'rgb(' + c(r) + ',' + c(g) + ',' + c(b) + ')';
  }

  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function elTxt(tag, cls, text) {
    var n = el(tag, cls);
    n.textContent = text;
    return n;
  }

  function showLoading() {
    root.innerHTML =
      '<div class="heatmap-placeholder" aria-busy="true">' +
      '<div class="heatmap-skeleton"></div>' +
      '<p class="muted" style="text-align:center;margin-top:1rem;font-size:.85rem;">Loading contribution data...</p>' +
      '</div>';
  }

  function showError(msg) {
    root.innerHTML =
      '<div class="heatmap-error"><p class="muted">Could not load GitHub activity &mdash; <em>' + msg + '</em>.<br>' +
      '<a href="https://github.com/coderkirt" target="_blank" rel="noopener">View on GitHub &rarr;</a></p></div>';
  }

  init();
})();
