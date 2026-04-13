import { describe, it, expect } from "vitest";
import { parseKeychainOutput, type OAuthCredentials } from "../src/modules/keychain";

// We test the parsing logic, not the actual Keychain access

describe("parseKeychainOutput", () => {
  it("extracts accessToken from valid JSON", () => {
    const input = JSON.stringify({
      claudeAiOauth: {
        accessToken: "test-token-123",
        expiresAt: 1700000000.0,
        subscriptionType: "pro",
      },
    });
    const result = parseKeychainOutput(input);
    expect(result).toEqual({
      accessToken: "test-token-123",
      expiresAt: 1700000000.0,
      subscriptionType: "pro",
    });
  });

  it("returns null for invalid JSON", () => {
    expect(parseKeychainOutput("not json")).toBeNull();
  });

  it("returns null when claudeAiOauth is missing", () => {
    const input = JSON.stringify({ otherKey: {} });
    expect(parseKeychainOutput(input)).toBeNull();
  });

  it("returns null when accessToken is missing", () => {
    const input = JSON.stringify({
      claudeAiOauth: {
        expiresAt: 1700000000.0,
        subscriptionType: "pro",
      },
    });
    expect(parseKeychainOutput(input)).toBeNull();
  });
});
