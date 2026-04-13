import { describe, it, expect } from "vitest";
import { getBackgroundColor } from "../src/utils/colors";

describe("getBackgroundColor", () => {
  it("returns pure green for 0%", () => {
    expect(getBackgroundColor(0)).toBe("#2ecc71");
  });

  it("returns pure yellow at the yellow threshold", () => {
    expect(getBackgroundColor(50)).toBe("#f1c40f");
  });

  it("returns pure orange at the orange threshold", () => {
    expect(getBackgroundColor(75)).toBe("#e67e22");
  });

  it("returns pure red at the red threshold", () => {
    expect(getBackgroundColor(90)).toBe("#e74c3c");
  });

  it("returns pure red for 100%", () => {
    expect(getBackgroundColor(100)).toBe("#e74c3c");
  });

  it("blends green toward yellow at 25%", () => {
    const color = getBackgroundColor(25);
    // Should be halfway between green and yellow — not pure green or yellow
    expect(color).not.toBe("#2ecc71");
    expect(color).not.toBe("#f1c40f");
    // Should be a valid hex color
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("blends yellow toward orange at ~62%", () => {
    const color = getBackgroundColor(62);
    expect(color).not.toBe("#f1c40f");
    expect(color).not.toBe("#e67e22");
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("produces a smooth gradient (each step darker/warmer)", () => {
    const colors = [0, 25, 50, 62, 75, 82, 90].map((v) => getBackgroundColor(v));
    // All should be unique (gradient, not steps)
    const unique = new Set(colors);
    expect(unique.size).toBe(colors.length);
  });

  it("uses the higher of two values", () => {
    const single = getBackgroundColor(80);
    const dual = getBackgroundColor(30, 80);
    expect(dual).toBe(single);
  });

  it("accepts custom thresholds", () => {
    // At exactly the custom yellow threshold, should be pure yellow
    expect(getBackgroundColor(60, undefined, { yellow: 60, orange: 80, red: 95 })).toBe("#f1c40f");
    // Just below should be blended green→yellow, not pure green
    const below = getBackgroundColor(59, undefined, { yellow: 60, orange: 80, red: 95 });
    expect(below).not.toBe("#f1c40f");
    expect(below).toMatch(/^#[0-9a-f]{6}$/);
  });
});
