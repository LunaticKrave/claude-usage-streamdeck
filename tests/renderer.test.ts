// This file is superseded by tests/modules/renderer.test.ts
// Kept as a placeholder to avoid breaking test discovery expectations.
import { describe, it, expect } from "vitest";
import { renderButton, renderErrorButton, type ButtonData } from "../src/modules/renderer";

describe("renderButton (legacy)", () => {
  it("returns an SVG data URI", () => {
    const data: ButtonData = {
      fiveHourUtil: 17,
      sevenDayUtil: 11,
      resetLabel: "2h 13m",
      maxUtil: 17,
    };
    const result = renderButton(data);
    expect(result).toMatch(/^data:image\/svg\+xml;charset=utf8,/);
  });
});

describe("renderErrorButton (legacy)", () => {
  it("renders a setup state", () => {
    const result = renderErrorButton("Setup", "#95a5a6");
    expect(result).toMatch(/^data:image\/svg\+xml;charset=utf8,/);
    const svg = decodeURIComponent(result.replace("data:image/svg+xml;charset=utf8,", ""));
    expect(svg).toContain("Setup");
  });
});
