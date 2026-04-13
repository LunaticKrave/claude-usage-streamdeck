import { describe, it, expect } from "vitest";
import { getBackgroundColor } from "../src/utils/colors";

describe("getBackgroundColor", () => {
  it("returns pure green for 0%", () => {
    expect(getBackgroundColor(0)).toBe("#2ecc71");
  });

  it("returns pure yellow at the yellow threshold (70%)", () => {
    expect(getBackgroundColor(70)).toBe("#f1c40f");
  });

  it("returns pure red at the red threshold (90%)", () => {
    expect(getBackgroundColor(90)).toBe("#e74c3c");
  });

  it("returns pure red for 100%", () => {
    expect(getBackgroundColor(100)).toBe("#e74c3c");
  });

  it("blends green toward yellow at 35%", () => {
    const color = getBackgroundColor(35);
    expect(color).not.toBe("#2ecc71");
    expect(color).not.toBe("#f1c40f");
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("blends yellow toward red at 80%", () => {
    const color = getBackgroundColor(80);
    expect(color).not.toBe("#f1c40f");
    expect(color).not.toBe("#e74c3c");
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("produces a smooth gradient (each step unique)", () => {
    const colors = [0, 35, 70, 80, 90].map((v) => getBackgroundColor(v));
    const unique = new Set(colors);
    expect(unique.size).toBe(colors.length);
  });

  it("uses the higher of two values", () => {
    const single = getBackgroundColor(80);
    const dual = getBackgroundColor(30, 80);
    expect(dual).toBe(single);
  });

  it("accepts custom thresholds", () => {
    expect(getBackgroundColor(60, undefined, { yellow: 60, red: 95 })).toBe("#f1c40f");
    const below = getBackgroundColor(59, undefined, { yellow: 60, red: 95 });
    expect(below).not.toBe("#f1c40f");
    expect(below).toMatch(/^#[0-9a-f]{6}$/);
  });
});
