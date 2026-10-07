export const formatPercent = (value, digits = 1) => `${value > 0 ? '+' : ''}${Number(value).toFixed(digits)}%`;
export const formatScore = (value) => Number(value).toFixed(2);
export const formatArea = (value) => `${Number(value).toFixed(2)} km²`;
export const titleCase = (value = '') => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
