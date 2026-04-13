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

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function lerp(a: [number, number, number], b: [number, number, number], t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  return rgbToHex(
    Math.round(a[0] + (b[0] - a[0]) * clamped),
    Math.round(a[1] + (b[1] - a[1]) * clamped),
    Math.round(a[2] + (b[2] - a[2]) * clamped),
  );
}

const COLOR_STOPS = [
  hexToRgb(COLORS.green),
  hexToRgb(COLORS.yellow),
  hexToRgb(COLORS.orange),
  hexToRgb(COLORS.red),
];

export function getBackgroundColor(
  utilization1: number,
  utilization2?: number,
  thresholds: ColorThresholds = DEFAULT_THRESHOLDS
): string {
  const value = utilization2 !== undefined
    ? Math.max(utilization1, utilization2)
    : utilization1;

  const stops = [0, thresholds.yellow, thresholds.orange, thresholds.red];

  // Before first threshold — pure green
  if (value <= 0) return COLORS.green;
  // After last threshold — pure red
  if (value >= thresholds.red) return COLORS.red;

  // Find which segment we're in and interpolate
  for (let i = 0; i < stops.length - 1; i++) {
    if (value <= stops[i + 1]) {
      const t = (value - stops[i]) / (stops[i + 1] - stops[i]);
      return lerp(COLOR_STOPS[i], COLOR_STOPS[i + 1], t);
    }
  }

  return COLORS.red;
}

export { COLORS };
