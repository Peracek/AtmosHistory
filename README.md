# Atmos History

Tool to scrape temperature and sensor data from Atmos Cloud website and log to CSV, with interactive chart visualization.

## Features

- Scrapes sensor data from Atmos Cloud website at configurable intervals
- Logs data to CSV file with dynamic column handling
- Interactive chart visualization using ECharts
- Tracks 35+ sensor values including:
  - Temperature sensors (PF, PF2, PF3, AF, WF, SF, VF1, VF3, AGF, room temp)
  - Equipment status (pumps, fan, servos)
  - Heating/boiler modes
  - Operating statistics

## Requirements

- Node.js >= 18.0.0
- Atmos Cloud account

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
ATMOS_USERNAME=your_username
ATMOS_PASSWORD=your_password
POLL_INTERVAL=60
OUTPUT_FILE=atmos_history.csv
```

Or use command line arguments:

```bash
node index.js --username your_user --password your_pass --interval 60 --output data.csv
```

## Usage

### Start data collection

```bash
npm start
```

Or with debug output:

```bash
node index.js --debug
```

### View charts

In a separate terminal:

```bash
npm run chart
```

Then open http://localhost:3000 in your browser.

## Chart Panels

The visualization includes four synchronized panels:

1. **akumulace** - Accumulator tank temperatures (PF top, PF2 mid, PF3 bottom)
2. **topeni/bojler** - Room temperature and SF (hot water tank)
3. **topeni ON/OFF** - Heating pump (MKP1) status indicator
4. **AGF** - Flue gas temperature

Yellow highlighted areas indicate "Auto (Komfort)" heating mode periods.

## Project Structure

```
├── index.js        # Main entry point, polling loop
├── serve.js        # Simple HTTP server for chart
├── chart.html      # ECharts visualization
├── src/
│   ├── client.js   # Atmos Cloud website scraper
│   ├── parser.js   # XML/HTML response parser
│   └── csv.js      # CSV file handling
└── .env            # Configuration (not in repo)
```

## License

MIT
