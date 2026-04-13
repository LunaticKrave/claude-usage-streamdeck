import { describe, it, expect } from "vitest";
import { getBackgroundColor } from "../src/utils/colors";

describe("getBackgroundColor", () => {
  it("returns green for 0%", () => {
    expect(getBackgroundColor(0)).toBe("#2ecc71");
  });

  it("returns green for 49%", () => {
    expect(getBackgroundColor(49)).toBe("#2ecc71");
  });

  it("returns yellow for 50%", () => {
    expect(getBackgroundColor(50)).toBe("#f1c40f");
  });

  it("returns yellow for 74%", () => {
    expect(getBackgroundColor(74)).toBe("#f1c40f");
  });

  it("returns orange for 75%", () => {
    expect(getBackgroundColor(75)).toBe("#e67e22");
  });

  it("returns orange for 89%", () => {
    expect(getBackgroundColor(89)).toBe("#e67e22");
  });

  it("returns red for 90%", () => {
    expect(getBackgroundColor(90)).toBe("#e74c3c");
  });

  it("returns red for 100%", () => {
    expect(getBackgroundColor(100)).toBe("#e74c3c");
  });

  it("uses the higher of two values", () => {
    expect(getBackgroundColor(30, 80)).toBe("#e67e22");
  });

  it("accepts custom thresholds", () => {
    expect(getBackgroundColor(60, undefined, { yellow: 60, orange: 80, red: 95 })).toBe("#f1c40f");
    expect(getBackgroundColor(59, undefined, { yellow: 60, orange: 80, red: 95 })).toBe("#2ecc71");
  });
});
