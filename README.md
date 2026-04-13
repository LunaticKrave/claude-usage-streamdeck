# Claude Usage — Stream Deck Plugin

A native Elgato Stream Deck plugin that displays your Claude (Pro/Max) subscription usage on a button. See your 5-hour and 7-day utilization at a glance, with a color-coded background that shifts from green to red as you approach your limits.

![Stream Deck Mini showing Claude usage stats](images/plugin-icon@2x.png)

## Features

- **Live utilization** — 5-hour and 7-day usage percentages updated every 60 seconds
- **Reset timer** — shows time until your nearest usage window resets
- **Color-coded** — background shifts green → yellow → orange → red based on utilization
- **Zero config** — auto-reads your Claude Code OAuth token from the macOS Keychain
- **Press to refresh** — tap the button for an immediate update
- **Configurable** — adjust poll interval and color thresholds via the Property Inspector

## Requirements

- macOS 10.15+
- Elgato Stream Deck software 6.0+
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and logged in (provides the OAuth token)
- Any Stream Deck model (Mini, MK.2, XL, Plus)

## Installation

### Prerequisites

1. Make sure you have [Node.js](https://nodejs.org/) installed (v20+)
2. Make sure [Claude Code](https://docs.anthropic.com/en/docs/claude-code) is installed and you're logged in
3. Make sure the [Elgato Stream Deck](https://www.elgato.com/downloads) software is installed

### Step 1: Clone and build

```bash
git clone https://github.com/LunaticKrave/claude-usage-streamdeck.git
cd claude-usage-streamdeck
npm install
npm run build
```

### Step 2: Install the plugin

Symlink the plugin into the Stream Deck plugins directory:

```bash
ln -s "$(pwd)" "$HOME/Library/Application Support/com.elgato.StreamDeck/Plugins/com.claude.usage.sdPlugin"
```

### Step 3: Restart Stream Deck

Quit and reopen the Elgato Stream Deck app, or run:

```bash
osascript -e 'quit app "Elgato Stream Deck"' && sleep 2 && open -a "Elgato Stream Deck"
```

### Step 4: Add the button

1. Open the Stream Deck app
2. Find the **"Claude"** category in the action list on the right
3. Drag **"Usage Display"** onto any button
4. Your Claude usage stats should appear within a few seconds

### Updating

```bash
cd claude-usage-streamdeck
git pull
npm install
npm run build
```

Then restart the Stream Deck app.

### Uninstalling

```bash
rm "$HOME/Library/Application Support/com.elgato.StreamDeck/Plugins/com.claude.usage.sdPlugin"
```

Then restart the Stream Deck app.

## Button Display

```
┌──────────────┐
│   5h: 17%    │  ← 5-hour utilization
│   7d: 11%    │  ← 7-day utilization
│   R: 2h 13m  │  ← time until reset
└──────────────┘
```

### Background Colors

| Utilization | Color  |
|-------------|--------|
| 0–49%       | Green  |
| 50–74%      | Yellow |
| 75–89%      | Orange |
| 90–100%     | Red    |

The color is based on whichever window (5h or 7d) has higher utilization.

### Status States

| Button Text | Meaning |
|-------------|---------|
| `Setup`     | No Claude Code OAuth token found — log in to Claude Code |
| `Wait`      | API rate limited — will retry automatically |
| `Auth`      | Token expired or invalid — re-authenticate Claude Code |
| `Error`     | Unexpected API error — will retry on next poll |

## Settings

Click the action in the Stream Deck app to open the Property Inspector:

- **Poll Interval** — how often to fetch usage (30s, 60s, 2m, or 5m)
- **Color Thresholds** — customize when the background changes color

## How It Works

1. Reads your OAuth token from the macOS Keychain (`Claude Code-credentials`)
2. Calls the Anthropic usage API (`api.anthropic.com/api/oauth/usage`)
3. Renders an SVG with your stats and pushes it to the button
4. Repeats on the configured interval

The usage API is undocumented and may change. The plugin handles errors gracefully and will keep retrying.

## Development

```bash
npm install          # install dependencies
npm test             # run tests (vitest)
npm run build        # bundle with esbuild
npm run test:watch   # run tests in watch mode
```

### Project Structure

```
src/
├── plugin.ts              # Entry point
├── actions/
│   └── usage-display.ts   # Main action — polling, lifecycle, rendering
├── modules/
│   ├── keychain.ts         # macOS Keychain token retrieval
│   ├── api-client.ts       # Anthropic usage API client
│   └── renderer.ts         # SVG button image generator
└── utils/
    ├── colors.ts           # Utilization → color mapping
    └── time-format.ts      # Time-until-reset formatting
```

## License

MIT
