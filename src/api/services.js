import { api } from './client';

export const waterbodyService = {
  getAll: api.getWaterbodies,
  getById: api.getWaterbody,
  getExtent: api.getWaterExtent,
};
export const analysisService = {
  getWaterExtent: api.getWaterExtent,
  getExtent: api.getWaterExtent,
  getRainfall: api.getRainfall,
  getResponse: api.getResponse,
  getVulnerability: api.getVulnerability,
};
export const insightService = { getAll: api.getInsights };
export const statusService = { getAll: api.getStatus };
export const regionService = { getAll: api.getRegions };
export const overviewService = { getSignals: api.getOverviewSignals };
