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

export async function fetchUsage(accessToken: string): Promise<UsageData | null> {
  const response = await fetch("https://api.anthropic.com/api/oauth/usage", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "anthropic-beta": "oauth-2025-04-20",
    },
  });

  if (!response.ok) return null;

  const data = await response.json();
  return parseUsageResponse(data);
}
