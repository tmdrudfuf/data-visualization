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
    return (
      p.name || p.ADMIN || p.NAME || p.name_long || p.formal_en || p.brk_name || "Unknown"
    );
  }

  function getIso3(feature) {
    const p = feature.properties || {};
    return (
      feature.id || p.ISO_A3 || p.iso_a3 || p.ISO3 || p.adm0_a3 || "N/A"
    );
  }

  function renderSummary(feature) {
    const iso3 = getIso3(feature);
    const countryName = getCountryName(feature);

    const headerHtml = `
      <div class="row">
        <b>${escapeHtml(countryName)}</b>
        <span class="badge">${escapeHtml(iso3)}</span>
      </div>
    `;

    const data = summaryByIso3[iso3];
    if (!data || !Array.isArray(data.lines) || data.lines.length === 0) {
      summaryBox.className = "row";
      summaryBox.innerHTML = headerHtml + `<div class="row muted">No summary data yet.</div>`;
      return;
    }

    const linesHtml = data.lines.map(line => `<div class="row">${escapeHtml(line)}</div>`).join("");
    summaryBox.className = "row";
    summaryBox.innerHTML = headerHtml + linesHtml;
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

    const labels = chartData.labels;
    const values = chartData.values;

    // Chart.js
    currentChart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: chartData.title || "Trend",
          data: values,
          tension: 0.25
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { ticks: { callback: (v) => Number(v).toLocaleString() } }
        }
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

  // Close interactions
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close === "1") closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  // ====== Country style ======
  const baseStyle = {
    fillColor: "#93c5fd",
    fillOpacity: 0.25,
    color: "#2563eb",
    weight: 1.2,
    opacity: 0.9
  };
  function styleFeature() { return baseStyle; }

  // ====== Events ======
  let geoLayer;

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({ weight: 2.8, fillOpacity: 0.45 });
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
      geoLayer = L.geoJSON(world, { style: styleFeature, onEachFeature }).addTo(map);
      clearSummary();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load World GeoJSON. Check your internet connection / URL.");
    });
})();
