const { queryApi } = require("../db/influx");

async function getSensorData(req, res) {
  try {
    const results = [];

    const fluxQuery = `
      from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -10m)
    `;

    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const obj = tableMeta.toObject(row);
        results.push(obj);
      },

      error(error) {
        console.error("Influx Query Error:", error);
        res.status(500).json({ error: "Influx query failed" });
      },

      complete() {
        //  Transform row-based data → structured JSON
        const formatted = {};

        results.forEach((row) => {
          const time = row._time;

          if (!formatted[time]) {
            formatted[time] = {
              timestamp: time,
            };
          }

          formatted[time][row._field.toLowerCase()] = row._value;
        });

        res.json(Object.values(formatted));
      },
    });

  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ error: "Error fetching sensor data" });
  }
}

module.exports = { getSensorData };