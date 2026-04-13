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

  // 3 lines: center block vertically. Font size 26 ≈ 20px cap height, line spacing ~38px
  // 2 lines: center block vertically with same spacing
  const lineHeight = 38;
  const fontSize1 = 26;
  const fontSize3 = 22;
  const numLines = line3 ? 3 : 2;
  const blockHeight = (numLines - 1) * lineHeight;
  const startY = 78 - blockHeight / 2;

  const textAttrs = `fill="white" text-anchor="middle" dominant-baseline="central" font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif"`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
  <rect width="144" height="144" rx="8" fill="${backgroundColor}"/>
  <text x="72" y="${startY}" font-size="${fontSize1}" font-weight="600" ${textAttrs}>${escapeXml(line1)}</text>
  <text x="72" y="${startY + lineHeight}" font-size="${fontSize1}" font-weight="600" ${textAttrs}>${escapeXml(line2)}</text>
  ${line3 ? `<text x="72" y="${startY + lineHeight * 2}" font-size="${fontSize3}" font-weight="400" ${textAttrs}>${escapeXml(line3)}</text>` : ""}
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
