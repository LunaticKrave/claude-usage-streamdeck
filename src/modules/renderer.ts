import { getTextColor } from "../utils/colors";
import type { ColorThresholds } from "../utils/colors";

export interface ButtonData {
  fiveHourUtil: number;
  sevenDayUtil: number;
  resetLabel: string | null;
  maxUtil: number;
  thresholds?: ColorThresholds;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const ARC_RADIUS = 38;
const ARC_CX = 72;
const ARC_CY = 64;
const CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;

export function renderButton(data: ButtonData): string {
  const { fiveHourUtil, sevenDayUtil, resetLabel, maxUtil, thresholds } = data;

  const dashLength = Math.min(CIRCUMFERENCE - 1, (fiveHourUtil / 100) * CIRCUMFERENCE);
  const textColor = getTextColor(maxUtil, thresholds);
  const sessionPct = `${Math.round(fiveHourUtil)}%`;
  const weeklyLabel = `7d ${Math.round(sevenDayUtil)}%`;
  const resetStr = resetLabel ? `↺ ${resetLabel}` : null;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a5f"/>
      <stop offset="100%" style="stop-color:#0d2137"/>
    </linearGradient>
  </defs>
  <rect width="144" height="144" rx="12" fill="url(#bg)"/>
  <circle cx="${ARC_CX}" cy="${ARC_CY}" r="${ARC_RADIUS}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="7"/>
  ${fiveHourUtil > 0 ? `<circle cx="${ARC_CX}" cy="${ARC_CY}" r="${ARC_RADIUS}" fill="none" stroke="#4a90d9" stroke-width="7"
          stroke-dasharray="${dashLength.toFixed(2)} ${CIRCUMFERENCE.toFixed(2)}"
          stroke-dashoffset="0"
          stroke-linecap="round"
          transform="rotate(-90 ${ARC_CX} ${ARC_CY})"/>` : ""}
  <text x="${ARC_CX}" y="59" font-size="26" font-weight="700" fill="${textColor}" text-anchor="middle"
        dominant-baseline="central" font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif">${escapeXml(sessionPct)}</text>
  <text x="${ARC_CX}" y="80" font-size="11" fill="rgba(255,255,255,0.45)" text-anchor="middle"
        dominant-baseline="central" font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif">SESSION</text>
  <line x1="14" y1="110" x2="130" y2="110" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="44" y="127" font-size="13" fill="rgba(255,255,255,0.55)" text-anchor="middle"
        dominant-baseline="central" font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif">${escapeXml(weeklyLabel)}</text>
  ${resetStr ? `<text x="100" y="127" font-size="13" fill="rgba(255,255,255,0.55)" text-anchor="middle"
        dominant-baseline="central" font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif">${escapeXml(resetStr)}</text>` : ""}
</svg>`;

  return `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`;
}

export function renderErrorButton(label: string, backgroundColor: string, subtitle?: string): string {
  const hasSubtitle = subtitle && subtitle.length > 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
  <rect width="144" height="144" rx="8" fill="${backgroundColor}"/>
  <text x="72" y="${hasSubtitle ? "65" : "80"}" font-size="28" font-weight="600" fill="white" text-anchor="middle"
        font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif">${escapeXml(label)}</text>
  ${hasSubtitle ? `<text x="72" y="100" font-size="22" font-weight="400" fill="white" text-anchor="middle"
        font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif">${escapeXml(subtitle)}</text>` : ""}
</svg>`;

  return `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`;
}
