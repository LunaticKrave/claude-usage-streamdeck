import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface OAuthCredentials {
  accessToken: string;
  expiresAt: number;
  subscriptionType: string;
}

export function parseKeychainOutput(output: string): OAuthCredentials | null {
  try {
    const data = JSON.parse(output);
    const oauth = data?.claudeAiOauth;
    if (!oauth?.accessToken) return null;
    return {
      accessToken: oauth.accessToken,
      expiresAt: oauth.expiresAt,
      subscriptionType: oauth.subscriptionType,
    };
  } catch {
    return null;
  }
}

export async function getAccessToken(): Promise<OAuthCredentials | null> {
  try {
    const { stdout } = await execFileAsync("security", [
      "find-generic-password",
      "-s",
      "Claude Code-credentials",
      "-w",
    ]);
    return parseKeychainOutput(stdout.trim());
  } catch {
    return null;
  }
}
