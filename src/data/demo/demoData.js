const months = [
  'Oct 25',
  'Nov 25',
  'Dec 25',
  'Jan 26',
  'Feb 26',
  'Mar 26',
  'Apr 26',
  'May 26',
  'Jun 26',
  'Jul 26',
  'Aug 26',
  'Sep 26',
];

const makeSeries = (base, current, phase = 0) => {
  return months.map((date, i) => {
    const progress = i / (months.length - 1);
    const wave = Math.sin((i + phase) / 1.8) * base * 0.025;
    const area =
      base + (current - base) * progress + wave;

    return {
      date,
      area: +Math.max(0.01, area).toFixed(3),
      baselineArea: +base.toFixed(3),
    };
  });
};

const makeRain = (base, anomaly, phase = 0) => {
  return months.map((date, i) => {
    const seasonal =
      Math.cos((i + phase) / 1.7) * base * 0.18;

    const rainfall =
      base +
      seasonal +
      (i === months.length - 1
        ? base * (anomaly / 100)
        : 0);

    return {
      date,
      rainfall: +Math.max(0, rainfall).toFixed(1),
      baselineRainfall: +base.toFixed(1),
      anomaly:
        +(((rainfall - base) / base) * 100).toFixed(1),
    };
  });
};


// ============================================================
// HYDRONEX DEMO WATERBODY NETWORK
// Chennai-region demonstration dataset
// ============================================================

export const waterbodies = [
  {
    id: 'chembarambakkam',
    name: 'Chembarambakkam Lake',
    short: 'Chembarambakkam',
    region: 'Chennai Basin',
    lat: 13.01158,
    lon: 80.06063,

    currentArea: 18.254,
    historicalAverageArea: 18.559,
    areaChangePercent: -1.6,
    rainfallAnomalyPercent: 35.9,
    responseScore: 0.55,
    vulnerabilityScore: 12.2,
    vulnerabilityLevel: 'Low',
    trend: 'Recovering',

    color: '#55d69a',
    geometry: null,
    center: [400, 220],

    lastAnalyzed: '30 Sep 2026, 14:20 IST',
  },

  {
    id: 'puzhal',
    name: 'Puzhal Lake',
    short: 'Red Hills',
    region: 'Northern Chennai Basin',
    lat: 13.16667,
    lon: 80.17153,

    currentArea: 6.49,
    historicalAverageArea: 17.558,
    areaChangePercent: -63.0,
    rainfallAnomalyPercent: 20.3,
    responseScore: 0.26,
    vulnerabilityScore: 60.1,
    vulnerabilityLevel: 'High',
    trend: 'Declining',

    color: '#ff6f78',
    geometry: null,
    center: [400, 220],

    lastAnalyzed: '30 Sep 2026, 14:21 IST',
  },

  {
    id: 'poondi',
    name: 'Poondi Reservoir',
    short: 'Poondi',
    region: 'Kosasthalaiyar Basin',
    lat: 13.185,
    lon: 79.86,

    currentArea: 0.249,
    historicalAverageArea: 20.638,
    areaChangePercent: -98.8,
    rainfallAnomalyPercent: 14.8,
    responseScore: 0.35,
    vulnerabilityScore: 62.1,
    vulnerabilityLevel: 'High',
    trend: 'Declining',

    color: '#ff6f78',
    geometry: null,
    center: [400, 220],

    lastAnalyzed: '30 Sep 2026, 14:21 IST',
  },

  {
    id: 'cholavaram',
    name: 'Cholavaram Lake',
    short: 'Cholavaram',
    region: 'Northern Chennai Basin',
    lat: 13.22804,
    lon: 80.15193,

    currentArea: 0.024,
    historicalAverageArea: 4.9,
    areaChangePercent: -99.5,
    rainfallAnomalyPercent: 22.1,
    responseScore: 0.27,
    vulnerabilityScore: 60.4,
    vulnerabilityLevel: 'High',
    trend: 'Declining',

    color: '#ff6f78',
    geometry: null,
    center: [400, 220],

    lastAnalyzed: '30 Sep 2026, 14:21 IST',
  },

  {
    id: 'porur',
    name: 'Porur Lake',
    short: 'Porur',
    region: 'Adyar Basin',
    lat: 13.034223,
    lon: 80.15065,

    currentArea: 0.054,
    historicalAverageArea: 0.187,
    areaChangePercent: -71.1,
    rainfallAnomalyPercent: 25.8,
    responseScore: 0.71,
    vulnerabilityScore: 69.2,
    vulnerabilityLevel: 'High',
    trend: 'Declining',

    color: '#ff6f78',
    geometry: null,
    center: [400, 220],

    lastAnalyzed: '30 Sep 2026, 14:22 IST',
  },
];


// ============================================================
// DEMO TIME SERIES
// ============================================================

export const waterExtent = Object.fromEntries(
  waterbodies.map((water, index) => [
    water.id,
    makeSeries(
      water.historicalAverageArea,
      water.currentArea,
      index
    ),
  ])
);


export const rainfall = Object.fromEntries(
  waterbodies.map((water, index) => [
    water.id,
    makeRain(
      90 + index * 4,
      water.rainfallAnomalyPercent,
      index
    ),
  ])
);


// ============================================================
// RESPONSE ANALYSIS
// ============================================================

export const response = Object.fromEntries(
  waterbodies.map((water) => [
    water.id,
    {
      waterbodyId: water.id,

      responseScore: water.responseScore,

      associationMetric: +(
        water.responseScore - 0.08
      ).toFixed(2),

      lagEstimate:
        water.responseScore >= 0.7
          ? '2–3 months'
          : '1–2 months',

      trend:
        water.trend === 'Recovering'
          ? 'Improving'
          : water.trend === 'Declining'
            ? 'Under pressure'
            : 'Stable',

      rainfallAnomaly:
        water.rainfallAnomalyPercent,

      waterAreaChange:
        water.areaChangePercent,

      analysisPeriod:
        'Oct 2025 – Sep 2026',
    },
  ])
);


// ============================================================
// VULNERABILITY
// ============================================================

export const vulnerabilities = Object.fromEntries(
  waterbodies.map((water) => [
    water.id,
    {
      score: water.vulnerabilityScore,

      level: water.vulnerabilityLevel,

      components: {
        rainfallAnomaly: Math.round(
          Math.abs(
            water.rainfallAnomalyPercent
          ) * 0.4
        ),

        waterAreaChange: Math.round(
          Math.abs(
            water.areaChangePercent
          ) * 0.45
        ),

        historicalTrend:
          water.trend === 'Declining'
            ? 17
            : water.trend === 'Stable'
              ? 10
              : 6,

        response: Math.round(
          water.responseScore * 16
        ),
      },

      explanation:
        'Project-defined prioritization indicator combining rainfall anomaly, water-area change, historical trend and rainfall-water association.',
    },
  ])
);


// ============================================================
// INSIGHTS
// ============================================================

export const insights = [
  {
    id: 'i1',
    type: 'Waterbody signal',

    title:
      'Chembarambakkam shows a relatively stable water signal',

    location:
      'Chembarambakkam Lake · Chennai Basin',

    severity: 'Low',

    evidence: [
      'Water area ↓ 1.6%',
      'Rainfall anomaly ↑ 35.9%',
      'Response score 0.55',
    ],

    recommendation:
      'Continue monitoring the rainfall-water response through the next analysis cycle.',

    waterbodyId: 'chembarambakkam',
  },

  {
    id: 'i2',
    type: 'Emerging water stress',

    title:
      'Puzhal shows a strong surface-water decline signal',

    location:
      'Puzhal Lake · Northern Chennai Basin',

    severity: 'High',

    evidence: [
      'Water area ↓ 63.0%',
      'Rainfall anomaly ↑ 20.3%',
      'Response score 0.26',
    ],

    recommendation:
      'Prioritize closer monitoring and compare the satellite signal with local hydrological observations.',

    waterbodyId: 'puzhal',
  },

  {
    id: 'i3',
    type: 'High vulnerability signal',

    title:
      'Poondi shows a strong decline relative to its baseline',

    location:
      'Poondi Reservoir · Kosasthalaiyar Basin',

    severity: 'High',

    evidence: [
      'Water area ↓ 98.8%',
      'Rainfall anomaly ↑ 14.8%',
      'Response score 0.35',
    ],

    recommendation:
      'Investigate the observed surface-water signal alongside local reservoir and hydrological data.',

    waterbodyId: 'poondi',
  },

  {
    id: 'i4',
    type: 'Rainfall-sensitive',

    title:
      'Porur shows a strong rainfall-water response signal',

    location:
      'Porur Lake · Adyar Basin',

    severity: 'High',

    evidence: [
      'Water area ↓ 71.1%',
      'Rainfall anomaly ↑ 25.8%',
      'Response score 0.71',
    ],

    recommendation:
      'Maintain close monitoring of the rainfall-response relationship.',

    waterbodyId: 'porur',
  },
];


// ============================================================
// SYSTEM STATUS
// ============================================================

export const systemStatus = [
  {
    label: 'Google Earth Engine',
    value: 'Connected',
    detail:
      'Earth Engine integration is implemented in the live backend.',
    state: 'connected',
  },

  {
    label: 'Sentinel-2',
    value: 'Available',
    detail:
      'Sentinel-2 imagery is used for surface-water analysis.',
    state: 'connected',
  },

  {
    label: 'CHIRPS rainfall',
    value: 'Available',
    detail:
      'CHIRPS precipitation is used for rainfall time-series analysis.',
    state: 'connected',
  },

  {
    label: 'Backend API',
    value: 'Demo mode',
    detail:
      'Dashboard is currently displaying demonstration data.',
    state: 'demo',
  },

  {
    label: 'Study network',
    value: '5 waterbodies',
    detail:
      'Chennai-region demonstration network.',
    state: 'connected',
  },

  {
    label: 'Data mode',
    value: 'Demonstration',
    detail:
      'Values shown in this recording are demonstration values.',
    state: 'demo',
  },
];


// ============================================================
// REGIONS
// ============================================================

export const regions = [
  'All regions',
  ...new Set(
    waterbodies.map(
      (item) => item.region
    )
  ),
];


// ============================================================
// OVERVIEW KPIs
// ============================================================

export const kpis = {
  monitored: waterbodies.length,

  high: waterbodies.filter(
    (x) =>
      ['High', 'Critical'].includes(
        x.vulnerabilityLevel
      )
  ).length,

  rainfall: 21.8,

  areaChange: -66.8,

  strongResponse:
    waterbodies.filter(
      (x) => x.responseScore >= 0.7
    ).length,
};


// ============================================================
// OVERVIEW TRENDS
// ============================================================

export const overviewAreaTrend = [
  18.4,
  17.8,
  16.9,
  15.8,
  14.7,
  13.8,
  12.9,
  11.7,
  10.8,
  9.6,
  8.4,
  7.7,
];

export const overviewRainTrend = [
  78,
  91,
  106,
  82,
  96,
  88,
  104,
  92,
  118,
  101,
  127,
  112,
];