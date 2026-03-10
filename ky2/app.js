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

  let currentKey = categories[0]?.key || "total";
  let currentLabel = categories[0]?.label || "TOTAL";

  // ✅ If old metric key is still selected somewhere (cached UI etc), force to valid key
  const validKeys = new Set(categories.map(c => c.key));
  if (!validKeys.has(currentKey)) {
    currentKey = "total";
    currentLabel = (categories.find(c => c.key === "total")?.label) || "TOTAL";
  }

  // ===== Map =====
  const map = L.map("map", { worldCopyJump: true }).setView([20, 0], 2);

  // --- Panes (z-index layers) ---
  // Tiles live around 200. Overlays should be above.
  map.createPane("countriesPane");
  map.getPane("countriesPane").style.zIndex = 420;

  map.createPane("hkPane");
  map.getPane("hkPane").style.zIndex = 650;

  // ✅ Basemap: no labels
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }).addTo(map);

  // ✅ Labels overlay
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    attribution: "&copy; CARTO",
    opacity: 0.9
  }).addTo(map);

  // ===== Helpers =====
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
  }

  function getCountryName(feature) {
    const p = feature.properties || {};
    return (
      p.ADMIN ||
      p.NAME_EN ||
      p.FORMAL_EN ||
      p.NAME_LONG ||
      p.NAME ||
      p.name ||
      "Unknown"
    );
  }

  // ✅ FIX: Some Natural Earth features use ISO_A3 = "-99".
  // Map those cases by name -> ISO3 so your data (FRA, etc.) matches.
  const ISO3_FIX_BY_NAME = {
    "France": "FRA",
    "French Guiana": "GUF",
    "Guadeloupe": "GLP",
    "Martinique": "MTQ",
    "Mayotte": "MYT",
    "New Caledonia": "NCL",
    "Reunion": "REU",
    "Réunion": "REU",
    "Saint Pierre and Miquelon": "SPM",
    "Wallis and Futuna": "WLF",
    "French Polynesia": "PYF"
  };

  function pickNameForIsoFix(p) {
    // Try multiple name fields so it works across GeoJSON variants
    return (
      p.ADMIN ||
      p.NAME_EN ||
      p.FORMAL_EN ||
      p.NAME_LONG ||
      p.NAME ||
      p.name ||
      ""
    );
  }

  // Robust ISO3 + Hong Kong by name (if exists as separate feature)
  function getIso3(feature) {
    const p = feature.properties || {};
    let raw = (p.ISO_A3 || p.iso_a3 || p.ADM0_A3 || p.adm0_a3 || feature.id || "N/A");

    const nameRaw = pickNameForIsoFix(p);
    const name = String(nameRaw).toLowerCase();

    // Hong Kong special-case
    if (name.includes("hong kong") || name.includes("hongkong")) return "HKG";

    // ✅ If raw is "-99", fix by exact name match first
    if (String(raw) === "-99") {
      const fixed = ISO3_FIX_BY_NAME[nameRaw];
      if (fixed) return fixed;

      // ✅ Also handle minor name variations (just in case)
      if (name.includes("france")) return "FRA";
      if (name.includes("reunion") || name.includes("réunion")) return "REU";
    }

    return raw;
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

    // ✅ Safety: if currentKey isn't an option (old value), fall back to total
    if (![...metricSelect.options].some(o => o.value === currentKey)) {
      const fallback = categories.find(c => c.key === "total") || categories[0];
      currentKey = fallback.key;
      currentLabel = fallback.label;
    }

    metricSelect.value = currentKey;
    metricHint.textContent = `Showing: ${currentLabel}`;
  }

  // ===== Color bins (Yellow -> Red) + Legend =====
  let breaks = [];
  const binColors = ["#fef08a", "#facc15", "#fb923c", "#f97316", "#ef4444", "#b91c1c"];

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

  function fmt(n) { return Number(n).toLocaleString(); }

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

  function renderSummary(obj) {
    const iso3 = obj.iso3 || getIso3(obj);
    const name = obj.name || getCountryName(obj);
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

  function openCountryDetails(obj) {
    const iso3 = obj.iso3 || getIso3(obj);
    const name = obj.name || getCountryName(obj);

    detailTitle.textContent = name;
    detailSub.textContent = `ISO3: ${iso3}`;

    const selected = getCountFor(iso3, currentKey);
    const total = getCountFor(iso3, "total");

    renderNumbers([
      { k: currentLabel, v: (selected === null ? "No data" : selected.toLocaleString()) },
      { k: "TOTAL INT'L STUDENTS", v: (total === null ? "No data" : total.toLocaleString()) }
    ]);

    const chartData = countryData?.[iso3]?.charts?.[currentKey] || null;
    renderChart(chartData);

    detailNotes.textContent = countryNotes?.[iso3] || "No notes yet.";
    openModal();
  }

  function styleFeature(feature) {
    const iso3 = getIso3(feature);
    const v = getCountFor(iso3, currentKey);
    const c = colorForValue(v);

    return {
      fillColor: c,
      fillOpacity: 0.22,
      color: c,
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
        t.setStyle({ weight: 4.0, fillOpacity: 0.32 });

        // bringToFront is fine now because countries are in a lower pane than HK marker
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

  function applyCategory(catKey) {
    const found = categories.find(c => c.key === catKey) || categories[0];
    currentKey = found.key;
    currentLabel = found.label;

    metricHint.textContent = `Showing: ${currentLabel}`;

    computeBreaks(currentKey, 6);
    updateLegend();

    if (geoLayer) geoLayer.setStyle(styleFeature);
    updateHongKongOverlayStyle();

    clearSummary();
  }

  metricSelect.addEventListener("change", () => applyCategory(metricSelect.value));

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close === "1") closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  // ===== Hong Kong overlay (always-on hitbox, invisible) =====
  let hkMarker = null;

  function ensureHongKongOverlayIfNeeded(worldGeojson) {
    // ✅ Always create an invisible HK hitbox so it can sit above China polygon
    if (hkMarker) return;

    const hkLatLng = [22.3193, 114.1694];

    hkMarker = L.circleMarker(hkLatLng, {
      pane: "hkPane",
      radius: 12,              // hitbox size
      weight: 1,
      color: "transparent",
      opacity: 0,              // invisible stroke
      fillColor: "transparent",
      fillOpacity: 0,          // invisible fill
      interactive: true
    }).addTo(map);

    hkMarker.bindTooltip("Hong Kong (HKG)", { direction: "top" });
    hkMarker.bringToFront();

    hkMarker.on("mouseover", (e) => {
      if (e?.originalEvent) L.DomEvent.stop(e.originalEvent);
      hkMarker.setStyle({ radius: 13, weight: 1, opacity: 0, fillOpacity: 0 });
      hkMarker.bringToFront();
      renderSummary({ iso3: "HKG", name: "Hong Kong" });
    });

    hkMarker.on("mouseout", (e) => {
      if (e?.originalEvent) L.DomEvent.stop(e.originalEvent);
      hkMarker.setStyle({ radius: 12, weight: 1, opacity: 0, fillOpacity: 0 });
      clearSummary();
    });

    hkMarker.on("click", (e) => {
      if (e?.originalEvent) L.DomEvent.stop(e.originalEvent);
      openCountryDetails({ iso3: "HKG", name: "Hong Kong" });
    });

    updateHongKongOverlayStyle();
  }

  function updateHongKongOverlayStyle() {
    // ✅ Keep HK hitbox invisible (do not color it)
    if (!hkMarker) return;
    hkMarker.setStyle({
      fillColor: "transparent",
      color: "transparent",
      opacity: 0,
      fillOpacity: 0
    });
    hkMarker.bringToFront();
  }

  // ===== Load GeoJSON =====
  const WORLD_GEOJSON_URL =
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

  fetch(WORLD_GEOJSON_URL)
    .then(r => r.json())
    .then(world => {
      initSelect();
      legend.addTo(map);
      applyCategory(currentKey);

      // ✅ Put countries in a lower pane so HK overlay always stays on top
      geoLayer = L.geoJSON(world, {
        pane: "countriesPane",
        style: styleFeature,
        onEachFeature
      }).addTo(map);

      ensureHongKongOverlayIfNeeded(world);
      clearSummary();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load World GeoJSON. Check your internet connection / URL.");
    });
})();