export interface UsageWindow {
  utilization: number;
  resetsAt: string | null;
}

export interface UsageData {
  fiveHour: UsageWindow;
  sevenDay: UsageWindow;
}

export function parseUsageHeaders(headers: Headers): UsageData | null {
  const fiveHourUtil = parseFloat(headers.get("anthropic-ratelimit-unified-5h-utilization") ?? "");
  const sevenDayUtil = parseFloat(headers.get("anthropic-ratelimit-unified-7d-utilization") ?? "");

  if (isNaN(fiveHourUtil) || isNaN(sevenDayUtil)) return null;

  const fiveHourReset = headers.get("anthropic-ratelimit-unified-5h-reset");
  const sevenDayReset = headers.get("anthropic-ratelimit-unified-7d-reset");

  return {
    fiveHour: {
      utilization: fiveHourUtil * 100,
      resetsAt: fiveHourReset ? new Date(parseInt(fiveHourReset, 10) * 1000).toISOString() : null,
    },
    sevenDay: {
      utilization: sevenDayUtil * 100,
      resetsAt: sevenDayReset ? new Date(parseInt(sevenDayReset, 10) * 1000).toISOString() : null,
    },
  };
}

export interface FetchResult {
  data: UsageData | null;
  error: "rate_limited" | "auth_failed" | "unknown" | null;
  retryAfterSeconds: number | null;
}

export async function fetchUsage(accessToken: string): Promise<FetchResult> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": accessToken,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1,
        messages: [{ role: "user", content: "." }],
      }),
    });

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("retry-after") ?? "", 10);
      return { data: null, error: "rate_limited", retryAfterSeconds: isNaN(retryAfter) ? null : retryAfter };
    }
    if (response.status === 401 || response.status === 403) {
      return { data: null, error: "auth_failed", retryAfterSeconds: null };
    }

    const data = parseUsageHeaders(response.headers);
    return { data, error: data ? null : "unknown", retryAfterSeconds: null };
  } catch {
    return { data: null, error: "unknown", retryAfterSeconds: null };
  }
}
