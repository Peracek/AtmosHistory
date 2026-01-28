# Atmos Integration - Home Assistant Addon

This addon integrates your Atmos Cloud heating system with Home Assistant, providing temperature monitoring and data logging capabilities.

## Features

- Polls temperature and sensor data from Atmos Cloud at configurable intervals
- Logs data to CSV for historical analysis
- Tracks 35+ sensor values including:
  - Temperature sensors (PF, PF2, PF3, AF, WF, SF, VF1, VF3, AGF, room temp)
  - Equipment status (pumps, fan, servos)
  - Heating/boiler modes
  - Operating statistics

## Configuration

| Option | Description | Default |
|--------|-------------|---------|
| `username` | Atmos Cloud username | (required) |
| `password` | Atmos Cloud password | (required) |
| `poll_interval` | Seconds between polls | 120 |
| `output_file` | Path to CSV output | /share/atmos_history.csv |

## Output

The CSV file is written to the Home Assistant `/share` directory by default, making it accessible to other addons and integrations.

## Data Fields

The CSV includes timestamps and all available sensor readings from your Atmos heating system. New columns are automatically added when new sensors are detected.
