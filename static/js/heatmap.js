/**
 * GitHub Commit Heatmap
 * Fetches contribution data from /api/github-heatmap and renders
 * an interactive calendar heatmap styled to match the portfolio theme.
 */

(function () {
  const root = document.getElementById("gh-heatmap");
  if (!root) return;

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // â”€â”€ State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let allData = [];           // [{date, level, count}]
  let selectedYear = null;
  let tooltip = null;

  // â”€â”€ Bootstrap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function init() {
    showLoading();
    try {
      const res = await fetch("/api/github-heatmap");
      const json = await res.json();
      if (!json.ok || !json.data.length) throw new Error(json.error || "No data");
      allData = json.data;
      selectedYear = new Date(allData[allData.length - 1].date).getFullYear();
      render();
    } catch (err) {
      showError(err.message);
    }
  }

  // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function getYears() {
    const years = [...new Set(allData.map(d => d.date.slice(0, 4)))].sort();
    return years;
  }

  function dataForYear(year) {
    return allData.filter(d => d.date.startsWith(String(year)));
  }

  function totalCommits(data) {
    return data.reduce((s, d) => s + d.count, 0);
  }

  function longestStreak(data) {
    const map = {};
    data.forEach(d => { map[d.date] = d.count; });
    const dates = Object.keys(map).sort();
    let best = 0, cur = 0;
    dates.forEach(d => {
      cur = map[d] > 0 ? cur + 1 : 0;
      if (cur > best) best = cur;
    });
    return best;
  }

  function activeDays(data) {
    return data.filter(d => d.count > 0).length;
  }

  function buildWeekGrid(data) {
    // Build a map date â†’ {level, count}
    const map = {};
    data.forEach(d => { map[d.date] = d; });

    // Start from the first Sunday on or before the first date in the dataset
    const first = new Date(data[0].date + "T00:00:00");
    const last  = new Date(data[data.length - 1].date + "T00:00:00");

    // Align to Sunday
    const start = new Date(first);
    start.setDate(start.getDate() - start.getDay());

    const weeks = [];
    let week = [];
    const cur = new Date(start);

    while (cur <= last) {
      const iso = cur.toISOString().slice(0, 10);
      const entry = map[iso] || { date: iso, level: 0, count: 0 };
      week.push({ ...entry, inRange: cur >= first && cur <= last });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      cur.setDate(cur.getDate() + 1);
    }
    if (week.length) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return weeks;
  }

  function monthLabels(weeks) {
    // Return [{label, col}] where col is the week column index
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const day = week.find(d => d && d.date);
      if (!day) return;
      const m = new Date(day.date + "T00:00:00").getMonth();
      if (m !== lastMonth) {
        labels.push({ label: MONTHS[m], col: wi });
        lastMonth = m;
      }
    });
    return labels;
  }

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function render() {
    root.innerHTML = "";
    const yearData = dataForYear(selectedYear);
    const weeks = buildWeekGrid(yearData);
    const mLabels = monthLabels(weeks);
    const total = totalCommits(yearData);
    const streak = longestStreak(yearData);
    const active = activeDays(yearData);

    // Wrapper
    const wrap = el("div", "heatmap-wrap");

    // â”€â”€ Header row â”€â”€
    const header = el("div", "heatmap-header");
    const titleGroup = el("div", "heatmap-title-group");
    titleGroup.appendChild(elText("p", "section-label", "Activity"));
    const titleLine = elText("h2", "heatmap-title", `${total.toLocaleString()} contributions in ${selectedYear}`);
    titleGroup.appendChild(titleLine);
    header.appendChild(titleGroup);

    // Year pills
    const years = getYears();
    if (years.length > 1) {
      const yearPills = el("div", "heatmap-years");
      years.forEach(y => {
        const btn = el("button", "heatmap-year-btn" + (y == selectedYear ? " is-active" : ""));
        btn.textContent = y;
        btn.dataset.year = y;
        btn.addEventListener("click", () => {
          selectedYear = parseInt(btn.dataset.year);
          render();
        });
        yearPills.appendChild(btn);
      });
      header.appendChild(yearPills);
    }
    wrap.appendChild(header);

    // â”€â”€ Stats strip â”€â”€
    const stats = el("div", "heatmap-stats");
    [
      { label: "Total commits", value: total.toLocaleString() },
      { label: "Active days", value: active },
      { label: "Longest streak", value: streak + "d" },
    ].forEach(({ label, value }) => {
      const stat = el("div", "heatmap-stat");
      stat.appendChild(elText("span", "heatmap-stat__value", String(value)));
      stat.appendChild(elText("span", "heatmap-stat__label", label));
      stats.appendChild(stat);
    });
    wrap.appendChild(stats);

    // â”€â”€ Grid container â”€â”€
    const gridOuter = el("div", "heatmap-grid-outer");

    // Day-of-week labels
    const dayLabels = el("div", "heatmap-day-labels");
    [1, 3, 5].forEach(i => {
      // Only show Mon, Wed, Fri to avoid crowding
      const span = elText("span", "heatmap-day-label", DAYS[i]);
      span.style.gridRow = i + 1;
      dayLabels.appendChild(span);
    });
    gridOuter.appendChild(dayLabels);

    // Month labels + cell grid
    const gridWrap = el("div", "heatmap-grid-wrap");

    // Month label bar
    const monthBar = el("div", "heatmap-month-bar");
    monthBar.style.gridTemplateColumns = `repeat(${weeks.length}, 1fr)`;
    mLabels.forEach(({ label, col }) => {
      const span = elText("span", "heatmap-month-label", label);
      span.style.gridColumn = col + 1;
      monthBar.appendChild(span);
    });
    gridWrap.appendChild(monthBar);

    // Cell grid
    const grid = el("div", "heatmap-grid");
    grid.style.gridTemplateColumns = `repeat(${weeks.length}, 1fr)`;

    weeks.forEach((week) => {
      const col = el("div", "heatmap-col");
      week.forEach((day) => {
        const cell = el("div", "heatmap-cell");
        if (!day || !day.inRange) {
          cell.classList.add("heatmap-cell--empty");
        } else {
          cell.dataset.level = day.level;
          cell.dataset.date = day.date;
          cell.dataset.count = day.count;
          cell.setAttribute("aria-label", `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${formatDate(day.date)}`);
          cell.addEventListener("mouseenter", onCellEnter);
          cell.addEventListener("mouseleave", onCellLeave);
          cell.addEventListener("focus", onCellEnter);
          cell.addEventListener("blur", onCellLeave);
          cell.setAttribute("tabindex", "0");
          cell.setAttribute("role", "gridcell");
        }
        col.appendChild(cell);
      });
      grid.appendChild(col);
    });
    gridWrap.appendChild(grid);
    gridOuter.appendChild(gridWrap);
    wrap.appendChild(gridOuter);

    // â”€â”€ Legend â”€â”€
    const legend = el("div", "heatmap-legend");
    legend.appendChild(elText("span", "heatmap-legend__label", "Less"));
    [0, 1, 2, 3, 4].forEach(lv => {
      const cell = el("div", "heatmap-cell heatmap-legend__cell");
      cell.dataset.level = lv;
      legend.appendChild(cell);
    });
    legend.appendChild(elText("span", "heatmap-legend__label", "More"));
    wrap.appendChild(legend);

    root.appendChild(wrap);

    // Shared tooltip
    tooltip = document.getElementById("heatmap-tooltip");
    if (!tooltip) {
      tooltip = el("div", "heatmap-tooltip");
      tooltip.id = "heatmap-tooltip";
      tooltip.hidden = true;
      document.body.appendChild(tooltip);
    }
  }

  // â”€â”€ Tooltip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function onCellEnter(e) {
    const cell = e.currentTarget;
    const count = parseInt(cell.dataset.count, 10);
    const date = cell.dataset.date;
    if (!date) return;

    tooltip.innerHTML = `
      <strong>${count} contribution${count !== 1 ? "s" : ""}</strong>
      <span>${formatDate(date)}</span>
    `;
    tooltip.hidden = false;
    positionTooltip(e);
  }

  function onCellLeave() {
    if (tooltip) tooltip.hidden = true;
  }

  document.addEventListener("mousemove", (e) => {
    if (tooltip && !tooltip.hidden) positionTooltip(e);
  });

  function positionTooltip(e) {
    const { clientX: x, clientY: y } = e;
    const tw = tooltip.offsetWidth || 140;
    const th = tooltip.offsetHeight || 44;
    const margin = 12;
    let left = x - tw / 2;
    let top = y - th - margin;
    if (left < margin) left = margin;
    if (left + tw > window.innerWidth - margin) left = window.innerWidth - tw - margin;
    if (top < margin) top = y + margin;
    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  // â”€â”€ Loading / Error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function showLoading() {
    root.innerHTML = `
      <div class="heatmap-placeholder" aria-busy="true">
        <div class="heatmap-skeleton"></div>
        <p class="muted" style="text-align:center;margin-top:1rem;font-size:.85rem;">Loading contribution dataâ€¦</p>
      </div>`;
  }

  function showError(msg) {
    root.innerHTML = `
      <div class="heatmap-error">
        <p class="muted">Could not load GitHub activity â€” <em>${msg}</em>.<br>
        <a href="https://github.com/coderkirt" target="_blank" rel="noopener" data-hover>View on GitHub â†’</a></p>
      </div>`;
  }

  // â”€â”€ Tiny DOM helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function el(tag, cls) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  }

  function elText(tag, cls, text) {
    const node = el(tag, cls);
    node.textContent = text;
    return node;
  }

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }

  // â”€â”€ Go â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  init();
})();
