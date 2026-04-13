import { describe, it, expect } from "vitest";
import { renderButton, renderErrorButton, type ButtonData } from "../src/modules/renderer";

describe("renderButton", () => {
  it("returns an SVG data URI", () => {
    const data: ButtonData = {
      fiveHourUtil: 17,
      sevenDayUtil: 11,
      resetLabel: "2h 13m",
      backgroundColor: "#2ecc71",
    };
    const result = renderButton(data);
    expect(result).toMatch(/^data:image\/svg\+xml;charset=utf8,/);
  });

  it("includes utilization percentages in the SVG", () => {
    const data: ButtonData = {
      fiveHourUtil: 42,
      sevenDayUtil: 88,
      resetLabel: "5h 0m",
      backgroundColor: "#e67e22",
    };
    const result = renderButton(data);
    const svg = decodeURIComponent(result.replace("data:image/svg+xml;charset=utf8,", ""));
    expect(svg).toContain("5h: 42%");
    expect(svg).toContain("7d: 88%");
    expect(svg).toContain("5h 0m");
  });

  it("includes background color in the SVG", () => {
    const data: ButtonData = {
      fiveHourUtil: 0,
      sevenDayUtil: 0,
      resetLabel: null,
      backgroundColor: "#2ecc71",
    };
    const result = renderButton(data);
    const svg = decodeURIComponent(result.replace("data:image/svg+xml;charset=utf8,", ""));
    expect(svg).toContain("#2ecc71");
  });

  it("handles null reset label", () => {
    const data: ButtonData = {
      fiveHourUtil: 10,
      sevenDayUtil: 5,
      resetLabel: null,
      backgroundColor: "#2ecc71",
    };
    const result = renderButton(data);
    const svg = decodeURIComponent(result.replace("data:image/svg+xml;charset=utf8,", ""));
    expect(svg).toContain("5h: 10%");
    expect(svg).not.toContain("undefined");
  });
});

describe("renderErrorButton", () => {
  it("renders a setup state", () => {
    const result = renderErrorButton("Setup", "#95a5a6");
    expect(result).toMatch(/^data:image\/svg\+xml;charset=utf8,/);
    const svg = decodeURIComponent(result.replace("data:image/svg+xml;charset=utf8,", ""));
    expect(svg).toContain("Setup");
  });
});
