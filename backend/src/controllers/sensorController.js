const { queryApi } = require("../db/influx"); // adjust path if needed

const getSensorData = async (req, res) => {
  try {
    const query = `
      from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "sensor_data")
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 20)
    `;

    const result = [];

    await new Promise((resolve, reject) => {
      queryApi.queryRows(query, {
        next(row, tableMeta) {
          const data = tableMeta.toObject(row);

          console.log("ROW:", data);

          result.push({
            gas: data.gas,
            temp: data.temp ,
            vibration: data.vibration,
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