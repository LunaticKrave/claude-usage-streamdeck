export interface ColorThresholds {
  yellow: number;
  orange: number;
  red: number;
}

const DEFAULT_THRESHOLDS: ColorThresholds = {
  yellow: 50,
  orange: 75,
  red: 90,
};

const COLORS = {
  green: "#2ecc71",
  yellow: "#f1c40f",
  orange: "#e67e22",
  red: "#e74c3c",
  grey: "#95a5a6",
} as const;

export function getBackgroundColor(
  utilization1: number,
  utilization2?: number,
  thresholds: ColorThresholds = DEFAULT_THRESHOLDS
): string {
  const value = utilization2 !== undefined
    ? Math.max(utilization1, utilization2)
    : utilization1;

  if (value >= thresholds.red) return COLORS.red;
  if (value >= thresholds.orange) return COLORS.orange;
  if (value >= thresholds.yellow) return COLORS.yellow;
  return COLORS.green;
}

export { COLORS };
