# Changelog

## 1.0.0 (2026-04-12)

Initial release.

### Features

- Live display of Claude Pro/Max 5-hour and 7-day utilization percentages
- Reset timer showing time until nearest usage window resets
- Color-coded background (green → yellow → orange → red) based on utilization
- Auto-reads OAuth token from macOS Keychain (zero configuration)
- Press-to-refresh for immediate updates
- Configurable poll interval (30s / 60s / 2m / 5m)
- Configurable color thresholds via Property Inspector
- Graceful error states: Setup, Wait (rate limited), Auth, Error
- Stale data indicator when API is temporarily unreachable
