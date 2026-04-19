const { queryApi } = require("../db/influx");

const getSensorData = async (req, res) => {
  try {
    const query = `
      from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -10m)
        |> filter(fn: (r) => r._measurement == "sensor_data")
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 20)
    `;

    const result = [];

    await new Promise((resolve, reject) => {
      queryApi.queryRows(query, {
        next(row, tableMeta) {
          const data = tableMeta.toObject(row);

          result.push({
            gas: data.gas ?? 0,
            temp: data.temp ?? 0,
            vibration: data.vibration ?? 0,
            timestamp: data._time,
          });
        },
        error(error) {
          console.error("Influx Query Error:", error);
          reject(error);
        },
        complete() {
          resolve();
        },
      });
    });

    res.json(result);
  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ error: "Influx query failed" });
  }
};

module.exports = { getSensorData };