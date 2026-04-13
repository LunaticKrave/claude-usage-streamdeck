import { describe, it, expect, vi, afterEach } from "vitest";
import { formatTimeUntil, getNearestReset } from "../src/utils/time-format";

describe("formatTimeUntil", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns minutes only when under 1 hour", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-12T10:00:00Z"));
    expect(formatTimeUntil("2026-04-12T10:45:00Z")).toBe("45m");
  });

  it("returns hours and minutes", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-12T10:00:00Z"));
    expect(formatTimeUntil("2026-04-12T12:30:00Z")).toBe("2h 30m");
  });

  it("returns days and hours when over 24 hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-12T10:00:00Z"));
    expect(formatTimeUntil("2026-04-14T15:00:00Z")).toBe("2d 5h");
  });

  it("returns '<1m' when reset is imminent", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-12T10:00:00Z"));
    expect(formatTimeUntil("2026-04-12T10:00:30Z")).toBe("<1m");
  });

  it("returns null when reset is in the past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-12T10:00:00Z"));
    expect(formatTimeUntil("2026-04-12T09:00:00Z")).toBeNull();
  });

  it("returns null for null input", () => {
    expect(formatTimeUntil(null)).toBeNull();
  });
});

describe("getNearestReset", () => {
  it("returns the sooner of two timestamps", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-12T10:00:00Z"));
    const result = getNearestReset("2026-04-12T15:00:00Z", "2026-04-14T10:00:00Z");
    expect(result).toBe("2026-04-12T15:00:00Z");
  });

  it("returns the non-null timestamp when one is null", () => {
    const result = getNearestReset("2026-04-12T15:00:00Z", null);
    expect(result).toBe("2026-04-12T15:00:00Z");
  });

  it("returns null when both are null", () => {
    expect(getNearestReset(null, null)).toBeNull();
  });
});
