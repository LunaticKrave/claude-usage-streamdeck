import { describe, it, expect } from "vitest";
import { parseUsageResponse, type UsageData } from "../src/modules/api-client";

// Test the response parsing, not the actual HTTP call

describe("parseUsageResponse", () => {
  it("parses a valid usage response", () => {
    const response = {
      five_hour: { utilization: 17.0, resets_at: "2026-04-12T15:00:00Z" },
      seven_day: { utilization: 11.0, resets_at: "2026-04-18T10:00:00Z" },
    };
    const result = parseUsageResponse(response);
    expect(result).toEqual({
      fiveHour: { utilization: 17.0, resetsAt: "2026-04-12T15:00:00Z" },
      sevenDay: { utilization: 11.0, resetsAt: "2026-04-18T10:00:00Z" },
    });
  });

  it("handles null resets_at", () => {
    const response = {
      five_hour: { utilization: 0, resets_at: null },
      seven_day: { utilization: 0, resets_at: null },
    };
    const result = parseUsageResponse(response);
    expect(result).toEqual({
      fiveHour: { utilization: 0, resetsAt: null },
      sevenDay: { utilization: 0, resetsAt: null },
    });
  });

  it("returns null for missing five_hour", () => {
    const response = { seven_day: { utilization: 5, resets_at: null } };
    expect(parseUsageResponse(response)).toBeNull();
  });

  it("returns null for missing seven_day", () => {
    const response = { five_hour: { utilization: 5, resets_at: null } };
    expect(parseUsageResponse(response)).toBeNull();
  });

  it("returns null for malformed data", () => {
    expect(parseUsageResponse(null)).toBeNull();
    expect(parseUsageResponse("string")).toBeNull();
    expect(parseUsageResponse({})).toBeNull();
  });
});
