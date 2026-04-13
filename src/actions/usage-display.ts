// src/actions/usage-display.ts
import {
  action,
  SingletonAction,
  type WillAppearEvent,
  type WillDisappearEvent,
  type KeyDownEvent,
  type DidReceiveSettingsEvent,
} from "@elgato/streamdeck";
import type { JsonValue } from "@elgato/utils";
import { getAccessToken } from "../modules/keychain";
import { fetchUsage, type UsageData, type FetchResult } from "../modules/api-client";
import { renderButton, renderErrorButton } from "../modules/renderer";
import { getBackgroundColor, type ColorThresholds } from "../utils/colors";
import { formatTimeUntil, getNearestReset } from "../utils/time-format";

interface PluginSettings {
  [key: string]: JsonValue;
  pollInterval?: number;
  thresholdYellow?: number;
  thresholdOrange?: number;
  thresholdRed?: number;
}

@action({ UUID: "com.claude.usage.display" })
export class UsageDisplay extends SingletonAction<PluginSettings> {
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private lastUsage: UsageData | null = null;
  private settings: PluginSettings = {};

  override async onWillAppear(ev: WillAppearEvent<PluginSettings>): Promise<void> {
    this.settings = ev.payload.settings ?? {};
    await this.refresh(ev.action);
    this.startPolling(ev.action);
  }

  override async onWillDisappear(_ev: WillDisappearEvent<PluginSettings>): Promise<void> {
    this.stopPolling();
  }

  override async onKeyDown(ev: KeyDownEvent<PluginSettings>): Promise<void> {
    await this.refresh(ev.action);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PluginSettings>): Promise<void> {
    this.settings = ev.payload.settings ?? {};
    this.stopPolling();
    this.startPolling(ev.action);
  }

  private startPolling(actionInstance: { setImage(image: string): Promise<void> }): void {
    const interval = (this.settings.pollInterval ?? 60) * 1000;
    this.pollTimer = setInterval(() => this.refresh(actionInstance), interval);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private async refresh(actionInstance: { setImage(image: string): Promise<void> }): Promise<void> {
    const credentials = await getAccessToken();
    if (!credentials) {
      await actionInstance.setImage(renderErrorButton("Setup", "#95a5a6"));
      return;
    }

    const result = await fetchUsage(credentials.accessToken);
    if (!result.data) {
      if (this.lastUsage) {
        const image = this.buildImage(this.lastUsage, true);
        await actionInstance.setImage(image);
      } else {
        const label = result.error === "rate_limited" ? "Wait" :
                      result.error === "auth_failed" ? "Auth" : "Error";
        const color = result.error === "rate_limited" ? "#f39c12" : "#95a5a6";
        await actionInstance.setImage(renderErrorButton(label, color));
      }
      return;
    }

    this.lastUsage = result.data;
    const image = this.buildImage(result.data, false);
    await actionInstance.setImage(image);
  }

  private buildImage(usage: UsageData, stale: boolean): string {
    const thresholds: ColorThresholds = {
      yellow: this.settings.thresholdYellow ?? 50,
      orange: this.settings.thresholdOrange ?? 75,
      red: this.settings.thresholdRed ?? 90,
    };

    const backgroundColor = getBackgroundColor(
      usage.fiveHour.utilization,
      usage.sevenDay.utilization,
      thresholds
    );

    const nearestReset = getNearestReset(
      usage.fiveHour.resetsAt,
      usage.sevenDay.resetsAt
    );
    let resetLabel = formatTimeUntil(nearestReset);
    if (stale && resetLabel) {
      resetLabel += " ?";
    }

    return renderButton({
      fiveHourUtil: usage.fiveHour.utilization,
      sevenDayUtil: usage.sevenDay.utilization,
      resetLabel,
      backgroundColor,
    });
  }
}
