// data.js
// Rounded counts (Math.round) derived from your % dataset.

// 1) Categories (navbar order)
window.CATEGORIES = [
  { key: "total", label: "TOTAL INT'L STUDENTS" },
  { key: "business", label: "Business and management" },
  { key: "education", label: "Education" },
  { key: "engineering", label: "Engineering*" },
  { key: "fine_arts", label: "Fine and applied arts" },
  { key: "health", label: "Health professions*" },
  { key: "humanities", label: "Humanities" },
  { key: "intensive_english", label: "Intensive English" },
  { key: "math_cs", label: "Math and computer science*" },
  { key: "physical_life", label: "Physical and life sciences*" },
  { key: "social_sciences", label: "Social sciences" },
  { key: "other", label: "Other fields of study" },
  { key: "undeclared", label: "Undeclared" }
];

// 2) Per-country counts (ISO3 keys)
// These are already converted from % -> counts using Math.round(total * pct/100).
window.COUNTRY_DATA = {
  BGD: { // Bangladesh
    total: 20156, business: 1612, education: 242, engineering: 6793, fine_arts: 262, health: 564,
    humanities: 222, intensive_english: 20, math_cs: 4454, physical_life: 3104, social_sciences: 1189,
    other: 1552, undeclared: 141
  },
  BRA: { // Brazil
    total: 17277, business: 3594, education: 276, engineering: 2211, fine_arts: 1088, health: 570,
    humanities: 570, intensive_english: 207, math_cs: 1382, physical_life: 1883, social_sciences: 2073,
    other: 3162, undeclared: 276
  },
  CAN: { // Canada
    total: 29903, business: 5472, education: 688, engineering: 2661, fine_arts: 2153, health: 3140,
    humanities: 777, intensive_english: 30, math_cs: 2631, physical_life: 3110, social_sciences: 3319,
    other: 5084, undeclared: 837
  },
  CHN: { // China
    total: 265919, business: 29783, education: 5318, engineering: 47334, fine_arts: 15157, health: 3989,
    humanities: 3191, intensive_english: 1064, math_cs: 62757, physical_life: 27921, social_sciences: 27390,
    other: 34835, undeclared: 6914
  },
  COL: { // Colombia
    total: 10213, business: 1889, education: 235, engineering: 1634, fine_arts: 715, health: 266,
    humanities: 409, intensive_english: 368, math_cs: 746, physical_life: 1185, social_sciences: 1052,
    other: 1563, undeclared: 163
  },
  FRA: { // France
    total: 8698, business: 1992, education: 70, engineering: 1331, fine_arts: 348, health: 104,
    humanities: 374, intensive_english: 61, math_cs: 635, physical_life: 487, social_sciences: 896,
    other: 2027, undeclared: 374
  },
  DEU: { // Germany
    total: 9123, business: 2171, education: 164, engineering: 775, fine_arts: 347, health: 173,
    humanities: 420, intensive_english: 18, math_cs: 611, physical_life: 739, social_sciences: 1314,
    other: 1989, undeclared: 402
  },
  GHA: { // Ghana
    total: 12825, business: 1552, education: 616, engineering: 1835, fine_arts: 282, health: 988,
    humanities: 487, intensive_english: 13, math_cs: 1987, physical_life: 2078, social_sciences: 1398,
    other: 1450, undeclared: 154
  },
  HKG: { // Hong Kong
    total: 5492, business: 752, education: 99, engineering: 500, fine_arts: 582, health: 159,
    humanities: 148, intensive_english: 16, math_cs: 813, physical_life: 560, social_sciences: 714,
    other: 923, undeclared: 231
  },
  IND: { // India
    total: 363019, business: 41021, education: 1089, engineering: 82768, fine_arts: 3993, health: 9438,
    humanities: 1089, intensive_english: 0, math_cs: 157551, physical_life: 19966, social_sciences: 7623,
    other: 35576, undeclared: 2541
  },
  IDN: { // Indonesia
    total: 8104, business: 1734, education: 235, engineering: 1184, fine_arts: 373, health: 178,
    humanities: 138, intensive_english: 32, math_cs: 1151, physical_life: 681, social_sciences: 851,
    other: 1329, undeclared: 211
  },
  IRN: { // Iran
    total: 12656, business: 645, education: 202, engineering: 5619, fine_arts: 810, health: 405,
    humanities: 228, intensive_english: 25, math_cs: 1519, physical_life: 1822, social_sciences: 620,
    other: 721, undeclared: 38
  },
  ITA: { // Italy
    total: 6744, business: 1497, education: 94, engineering: 870, fine_arts: 351, health: 142,
    humanities: 371, intensive_english: 27, math_cs: 614, physical_life: 614, social_sciences: 870,
    other: 1120, undeclared: 175
  },
  JPN: { // Japan
    total: 13814, business: 2569, education: 221, engineering: 1022, fine_arts: 801, health: 249,
    humanities: 511, intensive_english: 1188, math_cs: 1036, physical_life: 870, social_sciences: 1658,
    other: 2997, undeclared: 677
  },
  MEX: { // Mexico
    total: 15652, business: 3303, education: 360, engineering: 2536, fine_arts: 1221, health: 579,
    humanities: 501, intensive_english: 172, math_cs: 1174, physical_life: 1784, social_sciences: 1456,
    other: 2363, undeclared: 219
  },
  NPL: { // Nepal
    total: 24890, business: 2962, education: 149, engineering: 3982, fine_arts: 274, health: 2440,
    humanities: 174, intensive_english: 0, math_cs: 7542, physical_life: 4082, social_sciences: 1070,
    other: 2016, undeclared: 199
  },
  NGA: { // Nigeria
    total: 21847, business: 2600, education: 524, engineering: 3911, fine_arts: 437, health: 2228,
    humanities: 743, intensive_english: 0, math_cs: 3386, physical_life: 3998, social_sciences: 1595,
    other: 2272, undeclared: 131
  },
  PAK: { // Pakistan
    total: 13165, business: 1961, education: 263, engineering: 2593, fine_arts: 237, health: 434,
    humanities: 250, intensive_english: 39, math_cs: 2777, physical_life: 1448, social_sciences: 1238,
    other: 1632, undeclared: 276
  },
  SAU: { // Saudi Arabia
    total: 12702, business: 1842, education: 356, engineering: 3862, fine_arts: 330, health: 1105,
    humanities: 229, intensive_english: 445, math_cs: 1397, physical_life: 978, social_sciences: 686,
    other: 1283, undeclared: 178
  },
  KOR: { // South Korea
    total: 42293, business: 5033, education: 888, engineering: 7011, fine_arts: 3976, health: 1988,
    humanities: 1184, intensive_english: 507, math_cs: 6175, physical_life: 3637, social_sciences: 4652,
    other: 5879, undeclared: 1353
  },
  ESP: { // Spain
    total: 9229, business: 2261, education: 120, engineering: 1670, fine_arts: 351, health: 194,
    humanities: 434, intensive_english: 37, math_cs: 831, physical_life: 757, social_sciences: 747,
    other: 1578, undeclared: 249
  },
  TWN: { // Taiwan
    total: 23263, business: 3931, education: 326, engineering: 4862, fine_arts: 1908, health: 698,
    humanities: 233, intensive_english: 326, math_cs: 4397, physical_life: 2163, social_sciences: 1279,
    other: 2722, undeclared: 465
  },
  TUR: { // Turkey/Türkiye
    total: 9413, business: 1111, education: 264, engineering: 2306, fine_arts: 527, health: 122,
    humanities: 264, intensive_english: 66, math_cs: 1469, physical_life: 838, social_sciences: 1299,
    other: 979, undeclared: 188
  },
  GBR: { // United Kingdom
    total: 11136, business: 2138, education: 178, engineering: 713, fine_arts: 668, health: 379,
    humanities: 535, intensive_english: 22, math_cs: 846, physical_life: 947, social_sciences: 1793,
    other: 2461, undeclared: 457
  },
  VNM: { // Vietnam
    total: 25584, business: 5987, education: 256, engineering: 2968, fine_arts: 870, health: 1382,
    humanities: 384, intensive_english: 768, math_cs: 5577, physical_life: 2226, social_sciences: 1330,
    other: 3198, undeclared: 665
  }
};

// Optional notes (you can fill later)
window.COUNTRY_NOTES = {};
