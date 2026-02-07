// data.js

// Hover summary (short)
window.COUNTRY_SUMMARY = {
  USA: { lines: ["Capital: Washington, D.C.", "Region: North America"] },
  KOR: { lines: ["Capital: Seoul", "Region: East Asia"] },
  JPN: { lines: ["Capital: Tokyo", "Region: East Asia"] }
};

// Click detail (big info + chart)
window.COUNTRY_DETAILS = {
  USA: {
    numbers: {
      "GDP (B$)": 26000,
      "Population (M)": 333,
      "Score (pts)": 78
    },
    chart: {
      title: "GDP trend (example)",
      labels: ["2020", "2021", "2022", "2023", "2024"],
      values: [21000, 23000, 25000, 25500, 26000]
    },
    notes: "This is placeholder data. Replace with your real dataset."
  },
  KOR: {
    numbers: {
      "GDP (B$)": 1700,
      "Population (M)": 51,
      "Score (pts)": 83
    },
    chart: {
      title: "Score trend (example)",
      labels: ["2020", "2021", "2022", "2023", "2024"],
      values: [78, 80, 81, 82, 83]
    },
    notes: "Add more details here later (sources, links, etc.)."
  },
  JPN: {
    numbers: {
      "GDP (B$)": 4200,
      "Population (M)": 124,
      "Score (pts)": 81
    },
    chart: {
      title: "Population trend (example)",
      labels: ["2020", "2021", "2022", "2023", "2024"],
      values: [126, 125, 124.5, 124.2, 124]
    }
  }
};
