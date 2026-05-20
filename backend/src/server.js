require("dotenv").config();

const app = require("./app");
require("./mqtt/subscriber");

const { writeApi } = require("./db/influx");
const pool = require("./db/postgres");

const PORT = process.env.PORT || 5000;

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS alerts (
      id SERIAL PRIMARY KEY,
      message TEXT,
      severity TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Alerts table initialized");
}

async function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down...`);

  try {
    await writeApi.close();
    console.log("InfluxDB write API closed");
  } catch (err) {
    console.error("Error closing Influx:", err);
  }

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", shutdown);

initializeDatabase()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
  });