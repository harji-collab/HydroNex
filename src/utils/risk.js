export const riskClass = (level = '') => `risk-${level.toLowerCase()}`;
export const riskTone = (level = '') => ({ Low:'#55d69a', Moderate:'#f2b66a', High:'#ff6f78', Critical:'#ff5464' }[level] || '#5ce1e6');
export const linePath = (values, width = 400, height = 100, padding = 6) => {
  if (!values?.length) return '';
  const min = Math.min(...values); const max = Math.max(...values); const span = max - min || 1;
  return values.map((value, index) => {
    const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / span) * (height - padding * 2);
    return `${index ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
};
export const areaPath = (values, width = 400, height = 100, padding = 6) => {
  const line = linePath(values, width, height, padding);
  if (!line) return '';
  return `${line} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;
};
