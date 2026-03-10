// data.js
// Academic Level counts (2024/25) from your Table 8 dataset.
// Total here is computed as undergraduate + graduate + non_degree + opt.

// 1) Categories (navbar order)
window.CATEGORIES = [
  { key: "total", label: "TOTAL INT'L STUDENTS" },
  { key: "undergraduate", label: "Undergraduate" },
  { key: "graduate", label: "Graduate" },
  { key: "non_degree", label: "Non-degree" },
  { key: "opt", label: "OPT" }
];

// 2) Per-country counts (ISO3 keys)
window.COUNTRY_DATA = {
  ABW: { // Aruba
    total: 69, undergraduate: 46, graduate: 12, non_degree: 1, opt: 10
  },
  AFG: { // Afghanistan
    total: 712, undergraduate: 374, graduate: 278, non_degree: 21, opt: 39
  },
  AGO: { // Angola
    total: 478, undergraduate: 278, graduate: 86, non_degree: 37, opt: 77
  },
  AIA: { // Anguilla
    total: 12, undergraduate: 12, graduate: 0, non_degree: 0, opt: 0
  },
  ALB: { // Albania
    total: 1143, undergraduate: 635, graduate: 294, non_degree: 41, opt: 214
  },
  AND: { // Andorra
    total: 28, undergraduate: 19, graduate: 4, non_degree: 3, opt: 2
  },
  ARE: { // United Arab Emirates
    total: 1808, undergraduate: 1319, graduate: 238, non_degree: 194, opt: 57
  },
  ARG: { // Argentina
    total: 3335, undergraduate: 1664, graduate: 1020, non_degree: 128, opt: 523
  },
  ARM: { // Armenia
    total: 525, undergraduate: 241, graduate: 168, non_degree: 21, opt: 95
  },
  ATG: { // Antigua and Barbuda
    total: 186, undergraduate: 121, graduate: 42, non_degree: 1, opt: 22
  },
  AUS: { // Australia
    total: 4620, undergraduate: 2413, graduate: 1086, non_degree: 489, opt: 632
  },
  AUT: { // Austria
    total: 1043, undergraduate: 420, graduate: 287, non_degree: 227, opt: 109
  },
  AZE: { // Azerbaijan
    total: 1329, undergraduate: 500, graduate: 617, non_degree: 32, opt: 180
  },
  BDI: { // Burundi
    total: 220, undergraduate: 124, graduate: 44, non_degree: 7, opt: 45
  },
  BEL: { // Belgium
    total: 1059, undergraduate: 453, graduate: 310, non_degree: 124, opt: 172
  },
  BEN: { // Benin
    total: 267, undergraduate: 134, graduate: 74, non_degree: 18, opt: 41
  },
  BFA: { // Burkina Faso
    total: 309, undergraduate: 149, graduate: 76, non_degree: 30, opt: 54
  },
  BGD: { // Bangladesh
    total: 20156, undergraduate: 4041, graduate: 13016, non_degree: 109, opt: 2990
  },
  BGR: { // Bulgaria
    total: 612, undergraduate: 329, graduate: 140, non_degree: 33, opt: 110
  },
  BHS: { // Bahamas
    total: 2764, undergraduate: 1948, graduate: 489, non_degree: 19, opt: 308
  },
  BIH: { // Bosnia and Herzegovina
    total: 517, undergraduate: 389, graduate: 65, non_degree: 7, opt: 56
  },
  BLR: { // Belarus
    total: 411, undergraduate: 215, graduate: 106, non_degree: 18, opt: 72
  },
  BLZ: { // Belize
    total: 382, undergraduate: 231, graduate: 88, non_degree: 5, opt: 58
  },
  BMU: { // Bermuda
    total: 228, undergraduate: 185, graduate: 27, non_degree: 3, opt: 13
  },
  BOL: { // Bolivia
    total: 1463, undergraduate: 803, graduate: 304, non_degree: 74, opt: 282
  },
  BRA: { // Brazil
    total: 17277, undergraduate: 8590, graduate: 5210, non_degree: 710, opt: 2767
  },
  BRB: { // Barbados
    total: 296, undergraduate: 179, graduate: 73, non_degree: 7, opt: 37
  },
  BRN: { // Brunei
    total: 31, undergraduate: 9, graduate: 12, non_degree: 2, opt: 8
  },
  BTN: { // Bhutan
    total: 228, undergraduate: 135, graduate: 68, non_degree: 3, opt: 22
  },
  BWA: { // Botswana
    total: 303, undergraduate: 151, graduate: 100, non_degree: 6, opt: 46
  },
  CAF: { // Central African Republic
    total: 11, undergraduate: 8, graduate: 0, non_degree: 1, opt: 2
  },
  CAN: { // Canada
    total: 29903, undergraduate: 15017, graduate: 9887, non_degree: 520, opt: 4479
  },
  CHE: { // Switzerland
    total: 1382, undergraduate: 606, graduate: 360, non_degree: 246, opt: 170
  },
  CHL: { // Chile
    total: 3092, undergraduate: 963, graduate: 1342, non_degree: 135, opt: 652
  },
  CHN: { // China
    total: 265919, undergraduate: 78583, graduate: 120229, non_degree: 5126, opt: 61981
  },
  CIV: { // Côte d'Ivoire
    total: 1188, undergraduate: 627, graduate: 246, non_degree: 101, opt: 214
  },
  CMR: { // Cameroon
    total: 1181, undergraduate: 575, graduate: 436, non_degree: 38, opt: 132
  },
  COD: { // Congo, Dem. Rep. of the (Kinshasa)
    total: 1794, undergraduate: 1134, graduate: 238, non_degree: 190, opt: 232
  },
  COG: { // Congo, Republic of the (Brazzaville)
    total: 178, undergraduate: 95, graduate: 30, non_degree: 25, opt: 28
  },
  COK: { // Cook Islands
    total: 18, undergraduate: 11, graduate: 4, non_degree: 0, opt: 3
  },
  COL: { // Colombia
    total: 10213, undergraduate: 3924, graduate: 3854, non_degree: 661, opt: 1774
  },
  COM: { // Comoros
    total: 22, undergraduate: 9, graduate: 12, non_degree: 1, opt: 0
  },
  CPV: { // Cabo Verde
    total: 57, undergraduate: 29, graduate: 7, non_degree: 1, opt: 20
  },
  CRI: { // Costa Rica
    total: 1461, undergraduate: 761, graduate: 423, non_degree: 32, opt: 245
  },
  CUB: { // Cuba
    total: 91, undergraduate: 29, graduate: 46, non_degree: 12, opt: 4
  },
  CUW: { // Curacao
    total: 37, undergraduate: 23, graduate: 8, non_degree: 0, opt: 6
  },
  CYM: { // Cayman Islands
    total: 164, undergraduate: 142, graduate: 17, non_degree: 0, opt: 5
  },
  CYP: { // Cyprus
    total: 438, undergraduate: 240, graduate: 106, non_degree: 19, opt: 73
  },
  CZE: { // Czech Republic
    total: 840, undergraduate: 500, graduate: 166, non_degree: 80, opt: 94
  },
  DEU: { // Germany
    total: 9123, undergraduate: 3161, graduate: 2486, non_degree: 2433, opt: 1043
  },
  DMA: { // Dominica
    total: 414, undergraduate: 186, graduate: 122, non_degree: 12, opt: 94
  },
  DNK: { // Denmark
    total: 1172, undergraduate: 457, graduate: 182, non_degree: 424, opt: 109
  },
  DOM: { // Dominican Republic
    total: 1582, undergraduate: 1010, graduate: 295, non_degree: 54, opt: 223
  },
  DJI: { // Djibouti
    total: 13, undergraduate: 9, graduate: 3, non_degree: 1, opt: 0
  },
  DZA: { // Algeria
    total: 426, undergraduate: 190, graduate: 160, non_degree: 29, opt: 47
  },
  ECU: { // Ecuador
    total: 3282, undergraduate: 1596, graduate: 948, non_degree: 187, opt: 551
  },
  EGY: { // Egypt
    total: 4518, undergraduate: 1436, graduate: 2116, non_degree: 247, opt: 719
  },
  ERI: { // Eritrea
    total: 80, undergraduate: 32, graduate: 37, non_degree: 5, opt: 6
  },
  ESP: { // Spain
    total: 9229, undergraduate: 4114, graduate: 2021, non_degree: 1712, opt: 1382
  },
  EST: { // Estonia
    total: 208, undergraduate: 138, graduate: 34, non_degree: 11, opt: 25
  },
  ETH: { // Ethiopia
    total: 3395, undergraduate: 2063, graduate: 830, non_degree: 37, opt: 465
  },
  FIN: { // Finland
    total: 543, undergraduate: 297, graduate: 104, non_degree: 85, opt: 57
  },
  FJI: { // Fiji
    total: 165, undergraduate: 127, graduate: 29, non_degree: 1, opt: 8
  },
  FLK: { // Falkland Islands/Islas Malvinas
    total: 0, undergraduate: 0, graduate: 0, non_degree: 0, opt: 0
  },
  FRA: { // France
    total: 8698, undergraduate: 2752, graduate: 2158, non_degree: 2361, opt: 1427
  },
  FSM: { // Micronesia, Federated States of
    total: 52, undergraduate: 37, graduate: 10, non_degree: 1, opt: 4
  },
  GAB: { // Gabon
    total: 235, undergraduate: 148, graduate: 35, non_degree: 20, opt: 32
  },
  GBR: { // United Kingdom
    total: 11136, undergraduate: 5596, graduate: 2694, non_degree: 1254, opt: 1592
  },
  GEO: { // Georgia
    total: 1040, undergraduate: 412, graduate: 410, non_degree: 42, opt: 176
  },
  GHA: { // Ghana
    total: 12825, undergraduate: 2446, graduate: 8514, non_degree: 81, opt: 1784
  },
  GIB: { // Gibraltar
    total: 7, undergraduate: 2, graduate: 3, non_degree: 1, opt: 1
  },
  GIN: { // Guinea
    total: 83, undergraduate: 58, graduate: 11, non_degree: 5, opt: 9
  },
  GMB: { // Gambia, The
    total: 430, undergraduate: 141, graduate: 220, non_degree: 13, opt: 56
  },
  GNB: { // Guinea-Bissau
    total: 9, undergraduate: 4, graduate: 4, non_degree: 0, opt: 1
  },
  GNQ: { // Equatorial Guinea
    total: 217, undergraduate: 173, graduate: 15, non_degree: 19, opt: 10
  },
  GRC: { // Greece
    total: 2641, undergraduate: 915, graduate: 1072, non_degree: 69, opt: 585
  },
  GRD: { // Grenada
    total: 200, undergraduate: 110, graduate: 48, non_degree: 4, opt: 38
  },
  GRL: { // Greenland
    total: 0, undergraduate: 0, graduate: 0, non_degree: 0, opt: 0
  },
  GTM: { // Guatemala
    total: 1344, undergraduate: 783, graduate: 303, non_degree: 32, opt: 226
  },
  GUF: { // French Guiana
    total: 4, undergraduate: 0, graduate: 2, non_degree: 1, opt: 1
  },
  GUY: { // Guyana
    total: 344, undergraduate: 185, graduate: 115, non_degree: 4, opt: 40
  },
  HKG: { // Hong Kong
    total: 5492, undergraduate: 2687, graduate: 1564, non_degree: 166, opt: 1075
  },
  HND: { // Honduras
    total: 2548, undergraduate: 1612, graduate: 517, non_degree: 67, opt: 352
  },
  HTI: { // Haiti
    total: 896, undergraduate: 551, graduate: 211, non_degree: 43, opt: 91
  },
  HUN: { // Hungary
    total: 848, undergraduate: 484, graduate: 198, non_degree: 76, opt: 90
  },
  IDN: { // Indonesia
    total: 8104, undergraduate: 3494, graduate: 2676, non_degree: 274, opt: 1660
  },
  IND: { // India
    total: 363019, undergraduate: 40135, graduate: 177892, non_degree: 1252, opt: 143740
  },
  IRL: { // Ireland
    total: 1404, undergraduate: 592, graduate: 359, non_degree: 266, opt: 187
  },
  IRN: { // Iran
    total: 12656, undergraduate: 642, graduate: 10154, non_degree: 97, opt: 1763
  },
  IRQ: { // Iraq
    total: 572, undergraduate: 179, graduate: 303, non_degree: 17, opt: 73
  },
  ISL: { // Iceland
    total: 320, undergraduate: 180, graduate: 88, non_degree: 22, opt: 30
  },
  ISR: { // Israel
    total: 2266, undergraduate: 866, graduate: 899, non_degree: 102, opt: 399
  },
  ITA: { // Italy
    total: 6744, undergraduate: 2453, graduate: 2404, non_degree: 751, opt: 1136
  },
  JAM: { // Jamaica
    total: 3416, undergraduate: 2125, graduate: 791, non_degree: 29, opt: 471
  },
  JOR: { // Jordan
    total: 2768, undergraduate: 874, graduate: 1318, non_degree: 73, opt: 503
  },
  JPN: { // Japan
    total: 13814, undergraduate: 6327, graduate: 2744, non_degree: 3216, opt: 1527
  },
  KAZ: { // Kazakhstan
    total: 3102, undergraduate: 1435, graduate: 938, non_degree: 224, opt: 505
  },
  KEN: { // Kenya
    total: 5337, undergraduate: 2451, graduate: 1914, non_degree: 80, opt: 892
  },
  KGZ: { // Kyrgyzstan
    total: 1386, undergraduate: 1015, graduate: 208, non_degree: 62, opt: 101
  },
  KHM: { // Cambodia
    total: 1201, undergraduate: 795, graduate: 203, non_degree: 68, opt: 135
  },
  KIR: { // Kiribati
    total: 56, undergraduate: 43, graduate: 11, non_degree: 1, opt: 1
  },
  KNA: { // Saint Kitts and Nevis
    total: 208, undergraduate: 126, graduate: 44, non_degree: 9, opt: 29
  },
  KOR: { // South Korea
    total: 42293, undergraduate: 16650, graduate: 14836, non_degree: 2722, opt: 8085
  },
  KWT: { // Kuwait
    total: 5018, undergraduate: 3472, graduate: 780, non_degree: 579, opt: 187
  },
  LAO: { // Laos
    total: 124, undergraduate: 69, graduate: 19, non_degree: 19, opt: 17
  },
  LBN: { // Lebanon
    total: 1826, undergraduate: 458, graduate: 817, non_degree: 53, opt: 498
  },
  LBR: { // Liberia
    total: 290, undergraduate: 143, graduate: 103, non_degree: 2, opt: 42
  },
  LCA: { // Saint Lucia
    total: 216, undergraduate: 113, graduate: 63, non_degree: 1, opt: 39
  },
  LIE: { // Liechtenstein
    total: 17, undergraduate: 8, graduate: 3, non_degree: 5, opt: 1
  },
  LKA: { // Sri Lanka
    total: 3661, undergraduate: 561, graduate: 2355, non_degree: 14, opt: 731
  },
  LSO: { // Lesotho
    total: 70, undergraduate: 33, graduate: 22, non_degree: 0, opt: 15
  },
  LTU: { // Lithuania
    total: 343, undergraduate: 188, graduate: 78, non_degree: 18, opt: 59
  },
  LUX: { // Luxembourg
    total: 133, undergraduate: 57, graduate: 31, non_degree: 28, opt: 17
  },
  LVA: { // Latvia
    total: 271, undergraduate: 161, graduate: 60, non_degree: 13, opt: 37
  },
  MAC: { // Macau
    total: 397, undergraduate: 184, graduate: 132, non_degree: 11, opt: 70
  },
  MAR: { // Morocco
    total: 1975, undergraduate: 983, graduate: 510, non_degree: 128, opt: 354
  },
  MCO: { // Monaco
    total: 32, undergraduate: 17, graduate: 6, non_degree: 3, opt: 6
  },
  MDA: { // Moldova
    total: 154, undergraduate: 77, graduate: 48, non_degree: 6, opt: 23
  },
  MDG: { // Madagascar
    total: 251, undergraduate: 126, graduate: 89, non_degree: 5, opt: 31
  },
  MDV: { // Maldives
    total: 42, undergraduate: 23, graduate: 9, non_degree: 2, opt: 8
  },
  MEX: { // Mexico
    total: 15652, undergraduate: 8201, graduate: 4503, non_degree: 833, opt: 2115
  },
  MHL: { // Marshall Islands, Republic of the
    total: 30, undergraduate: 28, graduate: 1, non_degree: 1, opt: 0
  },
  MKD: { // North Macedonia
    total: 205, undergraduate: 108, graduate: 56, non_degree: 6, opt: 35
  },
  MLI: { // Mali
    total: 249, undergraduate: 141, graduate: 60, non_degree: 13, opt: 35
  },
  MLT: { // Malta
    total: 97, undergraduate: 58, graduate: 18, non_degree: 11, opt: 10
  },
  MMR: { // Burma
    total: 3744, undergraduate: 2825, graduate: 542, non_degree: 63, opt: 314
  },
  MNE: { // Montenegro
    total: 169, undergraduate: 103, graduate: 33, non_degree: 6, opt: 27
  },
  MNG: { // Mongolia
    total: 1991, undergraduate: 1253, graduate: 367, non_degree: 75, opt: 296
  },
  MOZ: { // Mozambique
    total: 198, undergraduate: 110, graduate: 51, non_degree: 11, opt: 26
  },
  MSR: { // Montserrat
    total: 2, undergraduate: 1, graduate: 0, non_degree: 0, opt: 1
  },
  MUS: { // Mauritius
    total: 239, undergraduate: 77, graduate: 75, non_degree: 0, opt: 87
  },
  MWI: { // Malawi
    total: 610, undergraduate: 214, graduate: 319, non_degree: 11, opt: 66
  },
  MYS: { // Malaysia
    total: 4485, undergraduate: 2185, graduate: 962, non_degree: 63, opt: 1275
  },
  NAM: { // Namibia
    total: 95, undergraduate: 50, graduate: 31, non_degree: 1, opt: 13
  },
  NCL: { // New Caledonia
    total: 2, undergraduate: 2, graduate: 0, non_degree: 0, opt: 0
  },
  NER: { // Niger
    total: 219, undergraduate: 75, graduate: 57, non_degree: 6, opt: 81
  },
  NGA: { // Nigeria
    total: 21847, undergraduate: 5677, graduate: 11617, non_degree: 159, opt: 4394
  },
  NIC: { // Nicaragua
    total: 696, undergraduate: 387, graduate: 180, non_degree: 28, opt: 101
  },
  NIU: { // Niue
    total: 4, undergraduate: 1, graduate: 3, non_degree: 0, opt: 0
  },
  NLD: { // Netherlands
    total: 2462, undergraduate: 1236, graduate: 548, non_degree: 422, opt: 256
  },
  NOR: { // Norway
    total: 1617, undergraduate: 847, graduate: 250, non_degree: 350, opt: 170
  },
  NPL: { // Nepal
    total: 24890, undergraduate: 12642, graduate: 8350, non_degree: 154, opt: 3744
  },
  NZL: { // New Zealand
    total: 1781, undergraduate: 1042, graduate: 373, non_degree: 71, opt: 295
  },
  OMN: { // Oman
    total: 1401, undergraduate: 960, graduate: 123, non_degree: 108, opt: 210
  },
  PAK: { // Pakistan
    total: 13165, undergraduate: 4629, graduate: 5816, non_degree: 203, opt: 2517
  },
  PAN: { // Panama
    total: 2233, undergraduate: 1430, graduate: 345, non_degree: 45, opt: 413
  },
  PER: { // Peru
    total: 5667, undergraduate: 2599, graduate: 1705, non_degree: 262, opt: 1101
  },
  PHL: { // Philippines
    total: 4573, undergraduate: 2521, graduate: 1261, non_degree: 93, opt: 698
  },
  PLW: { // Palau
    total: 58, undergraduate: 49, graduate: 7, non_degree: 2, opt: 0
  },
  PNG: { // Papua New Guinea
    total: 118, undergraduate: 78, graduate: 33, non_degree: 3, opt: 4
  },
  POL: { // Poland
    total: 1809, undergraduate: 936, graduate: 503, non_degree: 139, opt: 231
  },
  PRT: { // Portugal
    total: 1137, undergraduate: 579, graduate: 332, non_degree: 69, opt: 157
  },
  PRY: { // Paraguay
    total: 665, undergraduate: 351, graduate: 167, non_degree: 42, opt: 105
  },
  PSE: { // Palestinian Territories
    total: 500, undergraduate: 222, graduate: 178, non_degree: 14, opt: 86
  },
  PYF: { // French Polynesia
    total: 66, undergraduate: 60, graduate: 2, non_degree: 3, opt: 1
  },
  QAT: { // Qatar
    total: 350, undergraduate: 179, graduate: 109, non_degree: 53, opt: 9
  },
  REU: { // Reunion
    total: 6, undergraduate: 2, graduate: 0, non_degree: 0, opt: 4
  },
  ROU: { // Romania
    total: 956, undergraduate: 492, graduate: 257, non_degree: 58, opt: 149
  },
  RUS: { // Russia
    total: 4948, undergraduate: 2069, graduate: 1818, non_degree: 170, opt: 891
  },
  RWA: { // Rwanda
    total: 1359, undergraduate: 642, graduate: 414, non_degree: 15, opt: 288
  },
  SAU: { // Saudi Arabia
    total: 12702, undergraduate: 5867, graduate: 4943, non_degree: 753, opt: 1139
  },
  SDN: { // Sudan
    total: 417, undergraduate: 170, graduate: 174, non_degree: 11, opt: 62
  },
  SEN: { // Senegal
    total: 498, undergraduate: 309, graduate: 108, non_degree: 21, opt: 60
  },
  SGP: { // Singapore
    total: 4449, undergraduate: 1558, graduate: 1523, non_degree: 356, opt: 1012
  },
  SHN: { // Saint Helena
    total: 1, undergraduate: 1, graduate: 0, non_degree: 0, opt: 0
  },
  SLE: { // Sierra Leone
    total: 462, undergraduate: 192, graduate: 207, non_degree: 4, opt: 59
  },
  SLK: { // Slovakia
    total: 366, undergraduate: 207, graduate: 94, non_degree: 26, opt: 39
  },
  SVN: { // Slovenia
    total: 236, undergraduate: 126, graduate: 66, non_degree: 16, opt: 28
  },
  SWE: { // Sweden
    total: 2665, undergraduate: 1683, graduate: 327, non_degree: 369, opt: 286
  },
  SWZ: { // Eswatini
    total: 219, undergraduate: 119, graduate: 55, non_degree: 1, opt: 44
  },
  SYC: { // Seychelles
    total: 16, undergraduate: 13, graduate: 2, non_degree: 0, opt: 1
  },
  SYR: { // Syria
    total: 434, undergraduate: 237, graduate: 126, non_degree: 14, opt: 57
  },
  TCA: { // Turks and Caicos
    total: 40, undergraduate: 32, graduate: 5, non_degree: 0, opt: 3
  },
  TCD: { // Chad
    total: 115, undergraduate: 76, graduate: 26, non_degree: 9, opt: 4
  },
  TGO: { // Togo
    total: 247, undergraduate: 145, graduate: 59, non_degree: 16, opt: 27
  },
  THA: { // Thailand
    total: 5022, undergraduate: 2147, graduate: 1754, non_degree: 160, opt: 961
  },
  TJK: { // Tajikistan
    total: 234, undergraduate: 136, graduate: 58, non_degree: 10, opt: 30
  },
  TLS: { // Timor-Leste
    total: 47, undergraduate: 27, graduate: 11, non_degree: 6, opt: 3
  },
  TON: { // Tonga
    total: 195, undergraduate: 180, graduate: 12, non_degree: 0, opt: 3
  },
  TTO: { // Trinidad and Tobago
    total: 1419, undergraduate: 814, graduate: 387, non_degree: 7, opt: 211
  },
  TUN: { // Tunisia
    total: 769, undergraduate: 384, graduate: 229, non_degree: 34, opt: 122
  },
  TUR: { // Turkey/Türkiye
    total: 9413, undergraduate: 3364, graduate: 4050, non_degree: 269, opt: 1730
  },
  TWN: { // Taiwan
    total: 23263, undergraduate: 5528, graduate: 10205, non_degree: 917, opt: 6613
  },
  TZA: { // Tanzania
    total: 1140, undergraduate: 531, graduate: 406, non_degree: 19, opt: 184
  },
  UGA: { // Uganda
    total: 1495, undergraduate: 573, graduate: 684, non_degree: 29, opt: 209
  },
  UKR: { // Ukraine
    total: 2346, undergraduate: 1379, graduate: 562, non_degree: 118, opt: 287
  },
  URY: { // Uruguay
    total: 451, undergraduate: 192, graduate: 170, non_degree: 13, opt: 76
  },
  UZB: { // Uzbekistan
    total: 1310, undergraduate: 787, graduate: 312, non_degree: 22, opt: 189
  },
  VAT: { // Holy See
    total: 0, undergraduate: 0, graduate: 0, non_degree: 0, opt: 0
  },
  VCT: { // Saint Vincent and the Grenadines
    total: 112, undergraduate: 69, graduate: 26, non_degree: 0, opt: 17
  },
  VEN: { // Venezuela
    total: 3886, undergraduate: 2575, graduate: 618, non_degree: 160, opt: 533
  },
  VGB: { // British Virgin Islands
    total: 61, undergraduate: 43, graduate: 12, non_degree: 2, opt: 4
  },
  VNM: { // Vietnam
    total: 25584, undergraduate: 16156, graduate: 4436, non_degree: 1363, opt: 3629
  },
  VUT: { // Vanuatu
    total: 18, undergraduate: 14, graduate: 3, non_degree: 1, opt: 0
  },
  WLF: { // Wallis and Futuna
    total: 1, undergraduate: 0, graduate: 1, non_degree: 0, opt: 0
  },
  XKX: { // Kosovo
    total: 190, undergraduate: 96, graduate: 56, non_degree: 7, opt: 31
  },
  YEM: { // Yemen
    total: 258, undergraduate: 125, graduate: 81, non_degree: 21, opt: 31
  },
  ZAF: { // South Africa
    total: 2952, undergraduate: 1847, graduate: 643, non_degree: 51, opt: 411
  },
  ZMB: { // Zambia
    total: 743, undergraduate: 418, graduate: 213, non_degree: 11, opt: 101
  },
  ZWE: { // Zimbabwe
    total: 2712, undergraduate: 1141, graduate: 1148, non_degree: 19, opt: 404
  }
};

// Optional notes (you can fill later)
window.COUNTRY_NOTES = {};