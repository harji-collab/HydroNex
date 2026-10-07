import * as demo from '../data/demo/demoData';

const demoMode = import.meta.env.VITE_DEMO_MODE !== 'false';
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const wait = (value, delay = 220) => new Promise((resolve) => setTimeout(() => resolve(value), delay));
const request = async (path, fallback) => {
  if (demoMode) return wait(fallback);
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) throw new Error(`HydroNex API request failed: ${response.status}`);
  return response.json();
};

export const api = {
  isDemo: demoMode,
  baseUrl,
  getRegions: () => request('/regions', demo.regions),
  getWaterbodies: () => request('/waterbodies', demo.waterbodies),
  getWaterbody: (id) => request(`/waterbodies/${id}`, demo.waterbodies.find((item) => item.id === id)),
  getWaterExtent: (id) => request(`/waterbodies/${id}/water-extent`, demo.waterExtent[id] || []),
  getRainfall: (id) => request(`/waterbodies/${id}/rainfall`, demo.rainfall[id] || []),
  getResponse: (id) => request(`/waterbodies/${id}/response`, demo.response[id]),
  getVulnerability: (id) => request(`/waterbodies/${id}/vulnerability`, demo.vulnerabilities[id]),
  getInsights: () => request('/insights', demo.insights),
  getStatus: () => request('/analysis/status', demo.systemStatus),
  getOverviewSignals: () => request('/overview/signals', { kpis: demo.kpis, areaTrend: demo.overviewAreaTrend, rainTrend: demo.overviewRainTrend }),
};
