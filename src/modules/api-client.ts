export interface UsageWindow {
  utilization: number;
  resetsAt: string | null;
}

export interface UsageData {
  fiveHour: UsageWindow;
  sevenDay: UsageWindow;
}

export function parseUsageResponse(data: unknown): UsageData | null {
  if (!data || typeof data !== "object") return null;

  const obj = data as Record<string, unknown>;
  const fiveHour = obj.five_hour as { utilization?: number; resets_at?: string | null } | undefined;
  const sevenDay = obj.seven_day as { utilization?: number; resets_at?: string | null } | undefined;

  if (!fiveHour || typeof fiveHour.utilization !== "number") return null;
  if (!sevenDay || typeof sevenDay.utilization !== "number") return null;

  return {
    fiveHour: {
      utilization: fiveHour.utilization,
      resetsAt: fiveHour.resets_at ?? null,
    },
    sevenDay: {
      utilization: sevenDay.utilization,
      resetsAt: sevenDay.resets_at ?? null,
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
    const response = await fetch("https://api.anthropic.com/api/oauth/usage", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "anthropic-beta": "oauth-2025-04-20",
      },
    });

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("retry-after") ?? "", 10);
      return { data: null, error: "rate_limited", retryAfterSeconds: isNaN(retryAfter) ? null : retryAfter };
    }
    if (response.status === 401 || response.status === 403) return { data: null, error: "auth_failed", retryAfterSeconds: null };
    if (!response.ok) return { data: null, error: "unknown", retryAfterSeconds: null };

    const data = await response.json();
    const parsed = parseUsageResponse(data);
    return { data: parsed, error: parsed ? null : "unknown", retryAfterSeconds: null };
  } catch {
    return { data: null, error: "unknown", retryAfterSeconds: null };
  }
}
