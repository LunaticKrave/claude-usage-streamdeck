import { describe, it, expect } from "vitest";
import { getRingColor, getTextColor } from "../../src/utils/colors";

describe("getTextColor", () => {
  it("returns white below yellow threshold", () => {
    expect(getTextColor(0)).toBe("white");
    expect(getTextColor(50)).toBe("white");
    expect(getTextColor(69)).toBe("white");
  });

  it("returns yellow at and above yellow threshold", () => {
    expect(getTextColor(70)).toBe("#e8b84b");
    expect(getTextColor(85)).toBe("#e8b84b");
    expect(getTextColor(89)).toBe("#e8b84b");
  });

  it("returns red at and above red threshold", () => {
    expect(getTextColor(90)).toBe("#e05c4b");
    expect(getTextColor(99)).toBe("#e05c4b");
    expect(getTextColor(100)).toBe("#e05c4b");
  });

  it("respects custom thresholds", () => {
    expect(getTextColor(60, { yellow: 60, red: 80 })).toBe("#e8b84b");
    expect(getTextColor(80, { yellow: 60, red: 80 })).toBe("#e05c4b");
    expect(getTextColor(59, { yellow: 60, red: 80 })).toBe("white");
  });
});

describe("getRingColor", () => {
  it("returns blue below yellow threshold", () => {
    expect(getRingColor(0)).toBe("#4a90d9");
    expect(getRingColor(50)).toBe("#4a90d9");
    expect(getRingColor(69)).toBe("#4a90d9");
  });

  it("returns yellow at and above yellow threshold", () => {
    expect(getRingColor(70)).toBe("#e8b84b");
    expect(getRingColor(85)).toBe("#e8b84b");
    expect(getRingColor(89)).toBe("#e8b84b");
  });

  it("returns red at and above red threshold", () => {
    expect(getRingColor(90)).toBe("#e05c4b");
    expect(getRingColor(99)).toBe("#e05c4b");
    expect(getRingColor(100)).toBe("#e05c4b");
  });

  it("respects custom thresholds", () => {
    expect(getRingColor(60, { yellow: 60, red: 80 })).toBe("#e8b84b");
    expect(getRingColor(80, { yellow: 60, red: 80 })).toBe("#e05c4b");
    expect(getRingColor(59, { yellow: 60, red: 80 })).toBe("#4a90d9");
  });
});
