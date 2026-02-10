// app.js
(() => {
  // ===== DOM =====
  const summaryBox = document.getElementById("summaryBox");
  const metricSelect = document.getElementById("metricSelect");
  const metricHint = document.getElementById("metricHint");

  // Modal
  const modal = document.getElementById("detailModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const detailTitle = document.getElementById("detailTitle");
  const detailSub = document.getElementById("detailSub");
  const detailNumbers = document.getElementById("detailNumbers");
  const detailNotes = document.getElementById("detailNotes");
  const chartCanvas = document.getElementById("detailChart");
  const chartNote = document.getElementById("chartNote");

  // ===== Data =====
  const categories = window.CATEGORIES || [{ key: "total", label: "TOTAL INT'L STUDENTS" }];
  const countryData = window.COUNTRY_DATA || {};
  const countryNotes = window.COUNTRY_NOTES || {};

  // Current selected category
  let currentKey = categories[0]?.key || "total";
  let currentLabel = categories[0]?.label || "TOTAL";

  // ===== Map =====
  const map = L.map("map", { worldCopyJump: true }).setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // ===== Helpers =====
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[m]));
  }

  function getCountryName(feature) {
    const p = feature.properties || {};
    return (p.name || p.ADMIN || p.NAME || p.name_long || p.formal_en || p.brk_name || "Unknown");
  }

  function getIso3(feature) {
    const p = feature.properties || {};
    return (feature.id || p.ISO_A3 || p.iso_a3 || p.ISO3 || p.adm0_a3 || "N/A");
  }

  function getCountFor(iso3, catKey) {
    const v = countryData?.[iso3]?.[catKey];
    return Number.isFinite(v) ? v : null;
  }

  function clearSummary() {
    summaryBox.className = "row muted";
    summaryBox.textContent = "Hover over a country 👀";
  }

  // ===== Navbar init =====
  function initSelect() {
    metricSelect.innerHTML = "";
    categories.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.key;
      opt.textContent = c.label;
      metricSelect.appendChild(opt);
    });
    metricSelect.value = currentKey;
    metricHint.textContent = `Showing: ${currentLabel}`;
  }

  // ===== Color bins (Yellow -> Red) + Legend =====
  let breaks = []; // bin cutoffs
  const binColors = ["#fef08a", "#facc15", "#fb923c", "#f97316", "#ef4444", "#b91c1c"]; // 6 steps

  function computeBreaks(catKey, steps = 6) {
    const values = Object.keys(countryData)
      .map(iso3 => countryData[iso3]?.[catKey])
      .filter(v => Number.isFinite(v))
      .sort((a, b) => a - b);

    if (values.length === 0) {
      breaks = [];
      return;
    }

    const out = [];
    for (let i = 1; i <= steps; i++) {
      const idx = Math.min(values.length - 1, Math.ceil((i / steps) * values.length) - 1);
      out.push(values[idx]);
    }
    breaks = out;
  }

  function binIndexForValue(v) {
    if (!Number.isFinite(v) || breaks.length === 0) return -1;
    for (let i = 0; i < breaks.length; i++) {
      if (v <= breaks[i]) return i;
    }
    return breaks.length - 1;
  }

  function colorForValue(v) {
    const idx = binIndexForValue(v);
    if (idx < 0) return "#9ca3af"; // no data
    return binColors[Math.min(idx, binColors.length - 1)];
  }

  function fmt(n) { return Number(n).toLocaleString(); }

  // Leaflet legend control
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "leaflet-control leaflet-bar");
    div.style.background = "white";
    div.style.padding = "10px 12px";
    div.style.borderRadius = "12px";
    div.style.border = "1px solid #e5e7eb";
    div.style.boxShadow = "0 10px 30px rgba(0,0,0,0.12)";
    div.style.minWidth = "220px";

    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    div.innerHTML = `
      <div id="legendTitle" style="font-weight:800; font-size:13px; margin-bottom:8px;">Legend</div>
      <div id="legendItems" style="display:grid; gap:6px;"></div>
      <div style="margin-top:8px; color:#6b7280; font-size:11px;">Fill + border color by selected category</div>
    `;
    return div;
  };

  function updateLegend() {
    const titleEl = document.getElementById("legendTitle");
    const itemsEl = document.getElementById("legendItems");
    if (!itemsEl) return;

    if (titleEl) titleEl.textContent = currentLabel;

    if (breaks.length === 0) {
      itemsEl.innerHTML = `<div style="color:#6b7280; font-size:12px;">No data</div>`;
      return;
    }

    const ranges = [];
    for (let i = 0; i < breaks.length; i++) {
      const low = (i === 0) ? null : (breaks[i - 1] + 1);
      const high = breaks[i];
      ranges.push({ low, high, color: binColors[i] });
    }

    itemsEl.innerHTML = ranges.map(r => {
      const label = (r.low === null) ? `≤ ${fmt(r.high)}` : `${fmt(r.low)} – ${fmt(r.high)}`;
      return `
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:14px; height:14px; border-radius:4px; background:${r.color}; display:inline-block; border:1px solid rgba(0,0,0,.15);"></span>
          <span style="font-size:12px; color:#111827;">${label}</span>
        </div>
      `;
    }).join("");

    // Add "No data" row
    itemsEl.innerHTML += `
      <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
        <span style="width:14px; height:14px; border-radius:4px; background:#9ca3af; display:inline-block; border:1px solid rgba(0,0,0,.15);"></span>
        <span style="font-size:12px; color:#111827;">No data</span>
      </div>
    `;
  }

  // ===== Modal + Chart =====
  let currentChart = null;

  function openModal() {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    if (currentChart) { currentChart.destroy(); currentChart = null; }
  }

  function renderNumbers(rows) {
    detailNumbers.innerHTML = "";
    if (!rows || rows.length === 0) {
      detailNumbers.innerHTML = `<div class="row muted">No numbers yet.</div>`;
      return;
    }
    detailNumbers.innerHTML = rows.map(({ k, v }) => `
      <div class="kv">
        <div class="k">${escapeHtml(k)}</div>
        <div class="v">${escapeHtml(v)}</div>
      </div>
    `).join("");
  }

  function renderChart(chartData) {
    chartNote.textContent = "";
    if (!chartData || !Array.isArray(chartData.labels) || !Array.isArray(chartData.values)) {
      chartNote.textContent = "No chart data yet.";
      return;
    }
    if (currentChart) { currentChart.destroy(); currentChart = null; }

    currentChart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [{
          label: chartData.title || "Trend",
          data: chartData.values,
          tension: 0.25
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { ticks: { callback: (v) => Number(v).toLocaleString() } } }
      }
    });
  }

  // ===== Rendering: hover + click =====
  function renderSummary(feature) {
    const iso3 = getIso3(feature);
    const name = getCountryName(feature);
    const count = getCountFor(iso3, currentKey);

    const header = `
      <div class="row">
        <b>${escapeHtml(name)}</b>
        <span class="badge">${escapeHtml(iso3)}</span>
      </div>
    `;

    const line = (count === null)
      ? `<div class="row muted">No data for "${escapeHtml(currentLabel)}"</div>`
      : `<div class="row">Count: <b>${escapeHtml(count.toLocaleString())}</b></div>`;

    summaryBox.className = "row";
    summaryBox.innerHTML = header + line;
  }

  function openCountryDetails(feature) {
    const iso3 = getIso3(feature);
    const name = getCountryName(feature);

    detailTitle.textContent = name;
    detailSub.textContent = `ISO3: ${iso3}`;

    const selected = getCountFor(iso3, currentKey);
    const total = getCountFor(iso3, "total");

    const rows = [
      { k: currentLabel, v: (selected === null ? "No data" : selected.toLocaleString()) },
      { k: "TOTAL INT'L STUDENTS", v: (total === null ? "No data" : total.toLocaleString()) }
    ];

    renderNumbers(rows);

    const chartData = countryData?.[iso3]?.charts?.[currentKey] || null;
    renderChart(chartData);

    detailNotes.textContent = countryNotes?.[iso3] || "No notes yet.";
    openModal();
  }

  // ===== Style (✅ border + fill use the SAME color) =====
  function styleFeature(feature) {
    const iso3 = getIso3(feature);
    const v = getCountFor(iso3, currentKey);
    const c = colorForValue(v);

    return {
      fillColor: c,      // ✅ same as border
      fillOpacity: 0.22, // ✅ light fill
      color: c,          // border
      weight: 2.2,
      opacity: 0.98
    };
  }

  // ===== Events =====
  let geoLayer;

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: (e) => {
        const t = e.target;
        t.setStyle({ weight: 4.0, fillOpacity: 0.32 }); // ✅ slightly stronger on hover
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) t.bringToFront();
        renderSummary(feature);
      },
      mouseout: (e) => {
        geoLayer.resetStyle(e.target);
        clearSummary();
      },
      click: () => openCountryDetails(feature)
    });
  }

  // ===== Update map when category changes =====
  function applyCategory(catKey) {
    const found = categories.find(c => c.key === catKey) || categories[0];
    currentKey = found.key;
    currentLabel = found.label;

    metricHint.textContent = `Showing: ${currentLabel}`;

    computeBreaks(currentKey, 6);
    updateLegend();

    if (geoLayer) geoLayer.setStyle(styleFeature);
    clearSummary();
  }

  metricSelect.addEventListener("change", () => {
    applyCategory(metricSelect.value);
  });

  // ===== Modal close =====
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close === "1") closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  // ===== Load GeoJSON =====
  const WORLD_GEOJSON_URL =
    "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

  fetch(WORLD_GEOJSON_URL)
    .then(r => r.json())
    .then(world => {
      initSelect();

      // legend
      legend.addTo(map);

      // initial category
      applyCategory(currentKey);

      // geo layer
      geoLayer = L.geoJSON(world, { style: styleFeature, onEachFeature }).addTo(map);
      clearSummary();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load World GeoJSON. Check your internet connection / URL.");
    });
})();
