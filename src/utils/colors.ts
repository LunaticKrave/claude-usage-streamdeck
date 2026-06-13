export interface ColorThresholds {
  yellow: number;
  red: number;
}

const DEFAULT_THRESHOLDS: ColorThresholds = {
  yellow: 70,
  red: 90,
};

export function getTextColor(
  maxUtil: number,
  thresholds: ColorThresholds = DEFAULT_THRESHOLDS
): string {
  if (maxUtil >= thresholds.red) return "#e05c4b";
  if (maxUtil >= thresholds.yellow) return "#e8b84b";
  return "white";
}

export function getRingColor(
  util: number,
  thresholds: ColorThresholds = DEFAULT_THRESHOLDS
): string {
  if (util >= thresholds.red) return "#e05c4b";
  if (util >= thresholds.yellow) return "#e8b84b";
  return "#4a90d9";
}
