import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { fetchUsage, parseUsageHeaders } from "../src/modules/api-client";

describe("parseUsageHeaders", () => {
  function makeHeaders(entries: Record<string, string>): Headers {
    return new Headers(entries);
  }

  it("parses valid usage headers", () => {
    const headers = makeHeaders({
      "anthropic-ratelimit-unified-5h-utilization": "0.17",
      "anthropic-ratelimit-unified-7d-utilization": "0.11",
      "anthropic-ratelimit-unified-5h-reset": "1776056400",
      "anthropic-ratelimit-unified-7d-reset": "1776168000",
    });
    const result = parseUsageHeaders(headers);
    expect(result).toEqual({
      fiveHour: { utilization: 17, resetsAt: expect.any(String) },
      sevenDay: { utilization: 11, resetsAt: expect.any(String) },
    });
    // Verify reset timestamps are ISO strings
    expect(result!.fiveHour.resetsAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(result!.sevenDay.resetsAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("handles missing reset timestamps", () => {
    const headers = makeHeaders({
      "anthropic-ratelimit-unified-5h-utilization": "0.5",
      "anthropic-ratelimit-unified-7d-utilization": "0.3",
    });
    const result = parseUsageHeaders(headers);
    expect(result).toEqual({
      fiveHour: { utilization: 50, resetsAt: null },
      sevenDay: { utilization: 30, resetsAt: null },
    });
  });

  it("returns null when 5h utilization is missing", () => {
    const headers = makeHeaders({
      "anthropic-ratelimit-unified-7d-utilization": "0.1",
    });
    expect(parseUsageHeaders(headers)).toBeNull();
  });

  it("returns null when 7d utilization is missing", () => {
    const headers = makeHeaders({
      "anthropic-ratelimit-unified-5h-utilization": "0.1",
    });
    expect(parseUsageHeaders(headers)).toBeNull();
  });

  it("returns null when no usage headers present", () => {
    const headers = makeHeaders({});
    expect(parseUsageHeaders(headers)).toBeNull();
  });

  it("converts 0-1 scale to 0-100 percentages", () => {
    const headers = makeHeaders({
      "anthropic-ratelimit-unified-5h-utilization": "0.39",
      "anthropic-ratelimit-unified-7d-utilization": "0.43",
    });
    const result = parseUsageHeaders(headers);
    expect(result!.fiveHour.utilization).toBeCloseTo(39);
    expect(result!.sevenDay.utilization).toBeCloseTo(43);
  });
});

describe("fetchUsage authentication", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    fetchMock = vi.fn(async () => new Response("", {
      status: 200,
      headers: {
        "anthropic-ratelimit-unified-5h-utilization": "0.1",
        "anthropic-ratelimit-unified-7d-utilization": "0.1",
      },
    }));
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("sends the OAuth token via Authorization: Bearer, not x-api-key", async () => {
    await fetchUsage("sk-ant-oat-test-token");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    const headers = init.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer sk-ant-oat-test-token");
    expect(headers["x-api-key"]).toBeUndefined();
  });

  it("includes the anthropic-beta oauth flag", async () => {
    await fetchUsage("sk-ant-oat-test-token");
    const [, init] = fetchMock.mock.calls[0];
    const headers = init.headers as Record<string, string>;
    expect(headers["anthropic-beta"]).toBe("oauth-2025-04-20");
  });
});
