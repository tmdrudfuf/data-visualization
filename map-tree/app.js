// app.js
(() => {
  const summaryBox = document.getElementById("summaryBox");

  // Modal elements
  const modal = document.getElementById("detailModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const detailTitle = document.getElementById("detailTitle");
  const detailSub = document.getElementById("detailSub");
  const detailNumbers = document.getElementById("detailNumbers");
  const detailNotes = document.getElementById("detailNotes");
  const chartCanvas = document.getElementById("detailChart");
  const chartNote = document.getElementById("chartNote");

  // ====== Map ======
  const map = L.map("map", { worldCopyJump: true }).setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // ====== Data ======
  const summaryByIso3 = window.COUNTRY_SUMMARY || {};
  const detailByIso3 = window.COUNTRY_DETAILS || {};

  // ====== Helpers ======
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m]));
  }

  function clearSummary() {
    summaryBox.className = "row muted";
    summaryBox.textContent = "Hover over a country 👀";
  }

  function getCountryName(feature) {
    const p = feature.properties || {};
    return (p.name || p.ADMIN || p.NAME || p.name_long || p.formal_en || p.brk_name || "Unknown");
  }

  function getIso3(feature) {
    const p = feature.properties || {};
    return (feature.id || p.ISO_A3 || p.iso_a3 || p.ISO3 || p.adm0_a3 || "N/A");
  }

  function getCount(iso3) {
    const c = detailByIso3?.[iso3]?.numbers?.Count;
    return Number.isFinite(c) ? c : null;
  }

  function renderSummary(feature) {
    const iso3 = getIso3(feature);
    const countryName = getCountryName(feature);
    const count = getCount(iso3);

    const headerHtml = `
      <div class="row">
        <b>${escapeHtml(countryName)}</b>
        <span class="badge">${escapeHtml(iso3)}</span>
      </div>
    `;

    const data = summaryByIso3[iso3];
    if (data && Array.isArray(data.lines) && data.lines.length > 0) {
      const linesHtml = data.lines.map(line => `<div class="row">${escapeHtml(line)}</div>`).join("");
      summaryBox.className = "row";
      summaryBox.innerHTML = headerHtml + linesHtml;
      return;
    }

    const fallback = (count === null) ? "No count data yet." : `Count: ${count.toLocaleString()}`;
    summaryBox.className = "row";
    summaryBox.innerHTML = headerHtml + `<div class="row muted">${escapeHtml(fallback)}</div>`;
  }

  // ====== Modal + Chart ======
  let currentChart = null;

  function openModal() {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    if (currentChart) {
      currentChart.destroy();
      currentChart = null;
    }
  }

  function renderNumbers(numbersObj) {
    detailNumbers.innerHTML = "";
    if (!numbersObj || typeof numbersObj !== "object") {
      detailNumbers.innerHTML = `<div class="row muted">No numbers yet.</div>`;
      return;
    }
    const entries = Object.entries(numbersObj);
    if (entries.length === 0) {
      detailNumbers.innerHTML = `<div class="row muted">No numbers yet.</div>`;
      return;
    }
    detailNumbers.innerHTML = entries.map(([k, v]) => {
      const val = (typeof v === "number") ? v.toLocaleString() : String(v);
      return `
        <div class="kv">
          <div class="k">${escapeHtml(k)}</div>
          <div class="v">${escapeHtml(val)}</div>
        </div>
      `;
    }).join("");
  }

  function renderChart(chartData) {
    chartNote.textContent = "";
    if (!chartData || !Array.isArray(chartData.labels) || !Array.isArray(chartData.values)) {
      chartNote.textContent = "No chart data yet.";
      return;
    }
    if (currentChart) {
      currentChart.destroy();
      currentChart = null;
    }
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

  function openCountryDetails(feature) {
    const iso3 = getIso3(feature);
    const countryName = getCountryName(feature);
    const detail = detailByIso3[iso3];

    detailTitle.textContent = countryName;
    detailSub.textContent = `ISO3: ${iso3}`;

    if (!detail) {
      renderNumbers(null);
      renderChart(null);
      detailNotes.textContent = "No detailed info yet for this country.";
      openModal();
      return;
    }

    renderNumbers(detail.numbers);
    renderChart(detail.chart);
    detailNotes.textContent = detail.notes || "No notes yet.";
    openModal();
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close === "1") closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  // ====== Color bins: Yellow -> Red + Legend ======
  // We'll compute 6 bins from your data (more "obvious" steps).
  let breaks = []; // length 6

  function computeBreaksFromCounts(steps = 6) {
    const counts = Object.values(detailByIso3)
      .map(d => d?.numbers?.Count)
      .filter(v => Number.isFinite(v))
      .sort((a, b) => a - b);

    if (counts.length === 0) {
      breaks = [];
      return;
    }

    const out = [];
    for (let i = 1; i <= steps; i++) {
      const idx = Math.min(counts.length - 1, Math.ceil((i / steps) * counts.length) - 1);
      out.push(counts[idx]);
    }
    breaks = out; // ascending
  }

  // More distinct yellow->orange->red palette (6 steps)
  const binColors = [
    "#fef08a", // light yellow
    "#facc15", // yellow
    "#fb923c", // orange
    "#f97316", // deep orange
    "#ef4444", // red
    "#b91c1c"  // dark red
  ];

  function binIndexForCount(count) {
    if (!Number.isFinite(count) || breaks.length === 0) return -1;
    for (let i = 0; i < breaks.length; i++) {
      if (count <= breaks[i]) return i;
    }
    return breaks.length - 1;
  }

  function colorForCount(count) {
    const idx = binIndexForCount(count);
    if (idx < 0) return "#9ca3af"; // no data
    return binColors[Math.min(idx, binColors.length - 1)];
  }

  // ====== Legend control (bottom-right) ======
  function fmt(n) {
    return Number(n).toLocaleString();
  }

  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "leaflet-control leaflet-bar");
    div.style.background = "white";
    div.style.padding = "10px 12px";
    div.style.borderRadius = "12px";
    div.style.border = "1px solid #e5e7eb";
    div.style.boxShadow = "0 10px 30px rgba(0,0,0,0.12)";
    div.style.minWidth = "190px";

    // prevent map drag/zoom when interacting
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    div.innerHTML = `
      <div style="font-weight:800; font-size:13px; margin-bottom:8px;">Count Legend</div>
      <div id="legendItems" style="display:grid; gap:6px;"></div>
      <div style="margin-top:8px; color:#6b7280; font-size:11px;">Border color by Count</div>
    `;
    return div;
  };

  function updateLegend() {
    const container = document.getElementById("legendItems");
    if (!container) return;

    if (breaks.length === 0) {
      container.innerHTML = `<div style="color:#6b7280; font-size:12px;">No data</div>`;
      return;
    }

    // Build ranges:
    // bin0: <= breaks[0]
    // bin1: breaks[0]+1 .. breaks[1]
    // ...
    // last: > breaks[4] .. breaks[5]
    const ranges = [];
    for (let i = 0; i < breaks.length; i++) {
      const low = (i === 0) ? null : (breaks[i - 1] + 1);
      const high = breaks[i];
      ranges.push({ low, high, color: binColors[i] });
    }

    container.innerHTML = ranges.map(r => {
      const label = (r.low === null)
        ? `≤ ${fmt(r.high)}`
        : `${fmt(r.low)} – ${fmt(r.high)}`;
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:14px; height:14px; border-radius:4px; background:${r.color}; display:inline-block; border:1px solid rgba(0,0,0,.15);"></span>
            <span style="font-size:12px; color:#111827;">${label}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // ====== Style (border depends on Count) ======
  function styleFeature(feature) {
    const iso3 = getIso3(feature);
    const count = getCount(iso3);
    const border = colorForCount(count);

    return {
      fillColor: "#ffffff",  // keep fill clean so border stands out
      fillOpacity: 0.05,
      color: border,         // ✅ yellow -> red
      weight: 2.2,           // thicker so it's obvious
      opacity: 0.98
    };
  }

  // ====== Events ======
  let geoLayer;

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({ weight: 4.0, fillOpacity: 0.12 }); // hover emphasis
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) target.bringToFront();
        renderSummary(feature);
      },
      mouseout: (e) => {
        geoLayer.resetStyle(e.target);
        clearSummary();
      },
      click: () => {
        openCountryDetails(feature);
      }
    });
  }

  // ====== Load World GeoJSON ======
  const WORLD_GEOJSON_URL =
    "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

  fetch(WORLD_GEOJSON_URL)
    .then(r => r.json())
    .then(world => {
      computeBreaksFromCounts(6);
      legend.addTo(map);
      // legend DOM exists after addTo
      updateLegend();

      geoLayer = L.geoJSON(world, { style: styleFeature, onEachFeature }).addTo(map);
      clearSummary();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load World GeoJSON. Check your internet connection / URL.");
    });
})();
