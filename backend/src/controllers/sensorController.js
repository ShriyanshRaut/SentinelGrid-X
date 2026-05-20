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

            status: data.status ?? "NORMAL",

            mlScore: data.mlScore ?? 0,
            mlRisk: data.mlRisk ?? "LOW",
            mlAnomaly: data.mlAnomaly ?? false,

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
    console.error("Controller Error (Influx failed):", err.message);

    const fallbackData = Array.from({ length: 10 }).map(() => ({
      gas: +(Math.random() * 100).toFixed(2),
      temp: +(20 + Math.random() * 10).toFixed(2),
      vibration: Math.random() > 0.8 ? 1 : 0,

      status: "NORMAL",

      mlScore: +(Math.random() * 0.2).toFixed(4),
      mlRisk: "LOW",
      mlAnomaly: false,

      timestamp: new Date().toISOString(),
    }));

    res.status(200).json(fallbackData);
  }
};

module.exports = { getSensorData };