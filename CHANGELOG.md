# Changelog

## 1.1.0 (2026-04-13)

### Changed

- Redesigned button with a dark navy arc-ring layout — session utilization now displayed as a circular progress arc
- Fixed dark navy background replaces the old green → red gradient background
- Text color now indicates usage level (white → yellow → red) based on whichever window (session or weekly) is higher, so approaching weekly limits warns you even when the current session is low
- Bottom row shows weekly utilization and reset timer in clean white text

### Fixed

- SVG `rgba()` fill values replaced with `fill-opacity` attributes for correct rendering in all environments

---

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
