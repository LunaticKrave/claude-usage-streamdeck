export interface ButtonData {
  fiveHourUtil: number;
  sevenDayUtil: number;
  resetLabel: string | null;
  backgroundColor: string;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderButton(data: ButtonData): string {
  const { fiveHourUtil, sevenDayUtil, resetLabel, backgroundColor } = data;

  const line1 = `5h: ${Math.round(fiveHourUtil)}%`;
  const line2 = `7d: ${Math.round(sevenDayUtil)}%`;
  const line3 = resetLabel ? `R: ${resetLabel}` : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
  <rect width="144" height="144" rx="8" fill="${backgroundColor}"/>
  <style>
    text {
      font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
      fill: white;
      text-anchor: middle;
      font-weight: 600;
    }
  </style>
  <text x="72" y="${line3 ? "42" : "52"}" font-size="26">${escapeXml(line1)}</text>
  <text x="72" y="${line3 ? "76" : "86"}" font-size="26">${escapeXml(line2)}</text>
  ${line3 ? `<text x="72" y="114" font-size="22" font-weight="400">${escapeXml(line3)}</text>` : ""}
</svg>`;

  return `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`;
}

export function renderErrorButton(label: string, backgroundColor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
  <rect width="144" height="144" rx="8" fill="${backgroundColor}"/>
  <text x="72" y="80" font-size="28" font-weight="600" fill="white" text-anchor="middle"
        font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif">${escapeXml(label)}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`;
}
