import { describe, it, expect } from "vitest";
import { renderButton, renderErrorButton } from "../../src/modules/renderer";

describe("renderButton", () => {
  const base = {
    fiveHourUtil: 29,
    sevenDayUtil: 45,
    resetLabel: "3h 2m",
  };

  it("returns a data URI", () => {
    const result = renderButton(base);
    expect(result.startsWith("data:image/svg+xml;charset=utf8,")).toBe(true);
  });

  it("contains the dark navy background rect", () => {
    const svg = decodeURIComponent(renderButton(base).split(",")[1]);
    expect(svg).toContain("#0d2137");
  });

  it("contains the arc track circle", () => {
    const svg = decodeURIComponent(renderButton(base).split(",")[1]);
    expect(svg).toContain('stroke="rgba(255,255,255,0.1)"');
  });

  it("contains the arc fill circle in blue", () => {
    const svg = decodeURIComponent(renderButton(base).split(",")[1]);
    expect(svg).toContain('stroke="#4a90d9"');
  });

  it("shows the session percentage", () => {
    const svg = decodeURIComponent(renderButton(base).split(",")[1]);
    expect(svg).toContain("29%");
  });

  it("shows SESSION label", () => {
    const svg = decodeURIComponent(renderButton(base).split(",")[1]);
    expect(svg).toContain("SESSION");
  });

  it("shows 7d utilization in bottom row", () => {
    const svg = decodeURIComponent(renderButton(base).split(",")[1]);
    expect(svg).toContain("7d 45%");
  });

  it("shows reset label in bottom row", () => {
    const svg = decodeURIComponent(renderButton(base).split(",")[1]);
    expect(svg).toContain("↺ 3h 2m");
  });

  it("shows white text when maxUtil is below yellow threshold", () => {
    const svg = decodeURIComponent(renderButton(base).split(",")[1]);
    expect(svg).toContain('fill="white"');
  });

  it("shows yellow text when maxUtil is at yellow threshold", () => {
    const svg = decodeURIComponent(renderButton({ ...base, sevenDayUtil: 75 }).split(",")[1]);
    expect(svg).toContain("#e8b84b");
  });

  it("shows red text when maxUtil is at red threshold", () => {
    const svg = decodeURIComponent(renderButton({ ...base, sevenDayUtil: 92 }).split(",")[1]);
    expect(svg).toContain("#e05c4b");
  });

  it("handles null resetLabel gracefully", () => {
    const result = renderButton({ ...base, resetLabel: null });
    const svg = decodeURIComponent(result.split(",")[1]);
    expect(svg).not.toContain("↺");
  });

  it("does not render arc fill circle when fiveHourUtil is 0", () => {
    const svg = decodeURIComponent(renderButton({ ...base, fiveHourUtil: 0 }).split(",")[1]);
    expect(svg).not.toContain('stroke="#4a90d9"');
  });
});

describe("renderErrorButton", () => {
  it("returns a data URI", () => {
    expect(renderErrorButton("Error", "#95a5a6").startsWith("data:image/svg+xml;charset=utf8,")).toBe(true);
  });

  it("shows the label text", () => {
    const svg = decodeURIComponent(renderErrorButton("Auth", "#95a5a6").split(",")[1]);
    expect(svg).toContain("Auth");
  });
});
