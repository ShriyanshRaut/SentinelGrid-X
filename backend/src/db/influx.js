require("dotenv").config();

const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url, token });

const writeApi = client.getWriteApi(org, bucket);
const queryApi = client.getQueryApi(org);

function writeSensorData(data) {
  const point = new Point("sensor_data")
    .floatField("gas", Number(data.gas) || 0)
    .floatField("temp", Number(data.temp) || 0)
    .floatField("vibration", Number(data.vibration) || 0)

    .stringField("status", data.status || "NORMAL")

    .floatField("mlScore", Number(data.mlScore) || 0)
    .stringField("mlRisk", data.mlRisk || "LOW")
    .booleanField("mlAnomaly", Boolean(data.mlAnomaly))

    .timestamp(new Date(data.timestamp));

  writeApi.writePoint(point);
}

module.exports = {
  writeSensorData,
  writeApi,
  queryApi,
};