require("dotenv").config();

const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url, token });

const writeApi = client.getWriteApi(org, bucket);
const queryApi = client.getQueryApi(org);

// WRITE FUNCTION
function writeSensorData(data) {
  const point = new Point("sensor_data")
    .floatField("gas", data.gas)
    .floatField("temp", data.temp)
    .intField("vibration", data.vibration)
    .stringField("status", data.status)
    .timestamp(new Date(data.timestamp));

  writeApi.writePoint(point);
}

// EXPORT EVERYTHING
module.exports = {
  writeSensorData,
  writeApi,
  queryApi
};