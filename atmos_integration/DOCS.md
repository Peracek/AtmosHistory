# Atmos Integration

This addon connects your Atmos Cloud heating system to Home Assistant, exposing sensor data via a REST API that Home Assistant can poll.

## How It Works

1. The addon logs into your Atmos Cloud account
2. It polls sensor data at your configured interval
3. The latest data is exposed via REST API at `http://localhost:8099/api/sensors`
4. You configure Home Assistant's REST sensor integration to read from this endpoint
5. Home Assistant handles history and visualization

## Configuration

### Addon Options

| Option | Description |
|--------|-------------|
| `username` | Your Atmos Cloud username (email) |
| `password` | Your Atmos Cloud password |
| `poll_interval` | How often to poll Atmos Cloud (seconds, default: 120) |

### Home Assistant Configuration

After installing the addon, add REST sensors to your `configuration.yaml`:

```yaml
rest:
  - resource: http://localhost:8099/api/sensors
    scan_interval: 120
    sensor:
      - name: "Atmos Akumulace Top"
        value_template: "{{ value_json.sensors.pf }}"
        unit_of_measurement: "°C"
        device_class: temperature
        state_class: measurement

      - name: "Atmos Akumulace Mid"
        value_template: "{{ value_json.sensors.pf2 }}"
        unit_of_measurement: "°C"
        device_class: temperature
        state_class: measurement

      - name: "Atmos Akumulace Bottom"
        value_template: "{{ value_json.sensors.pf3 }}"
        unit_of_measurement: "°C"
        device_class: temperature
        state_class: measurement

      - name: "Atmos Room Temperature"
        value_template: "{{ value_json.sensors.roomTemp }}"
        unit_of_measurement: "°C"
        device_class: temperature
        state_class: measurement

      - name: "Atmos Hot Water"
        value_template: "{{ value_json.sensors.sf }}"
        unit_of_measurement: "°C"
        device_class: temperature
        state_class: measurement

      - name: "Atmos Outdoor Temperature"
        value_template: "{{ value_json.sensors.af }}"
        unit_of_measurement: "°C"
        device_class: temperature
        state_class: measurement

      - name: "Atmos Heating Mode"
        value_template: "{{ value_json.sensors.heating_mode }}"
```

After editing `configuration.yaml`, restart Home Assistant.

## Available Sensors

| Key | Description |
|-----|-------------|
| `pf` | Accumulator tank top temperature |
| `pf2` | Accumulator tank middle temperature |
| `pf3` | Accumulator tank bottom temperature |
| `af` | Outdoor temperature |
| `wf` | Boiler temperature |
| `sf` | Hot water tank temperature |
| `vf1` | Heating circuit 1 temperature |
| `vf3` | Heating circuit 3 temperature |
| `agf` | Flue gas temperature |
| `roomTemp` | Room temperature (thermostat) |
| `humidity` | Room humidity |
| `fan` | Fan status (0/1) |
| `mkp1`, `mkp2`, `mkp3` | Pump status |
| `heating_mode` | Current heating mode |
| `boiler_mode` | Current boiler mode |

## API Response Format

```json
{
  "timestamp": "2025-01-28T12:00:00.000Z",
  "sensors": {
    "pf": 65.2,
    "pf2": 58.1,
    "pf3": 45.0,
    "af": -2.5,
    "roomTemp": 21.5,
    "humidity": 45,
    "heating_mode": "Auto (Komfort)",
    ...
  }
}
```

## Troubleshooting

### Sensors show "unavailable"

- Check that the addon is running (green indicator)
- Verify your Atmos Cloud credentials are correct
- Check the addon logs for error messages
- Test the API directly: `curl http://localhost:8099/api/sensors`

### Data not updating

- The addon only updates when it successfully polls Atmos Cloud
- Check your `poll_interval` setting
- Atmos Cloud may have temporary connectivity issues

### Cannot connect to API

- Ensure the addon has started completely (check logs)
- The addon uses `host_network: true`, so port 8099 should be accessible on localhost
