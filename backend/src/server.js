require("dotenv").config();
const app = require("./app");
require("./mqtt/subscriber");

const PORT = 5000;

const { writeApi } = require("./db/influx");

async function shutdown(signal) {
  console.log(`\n Received ${signal}. Shutting down...`);

  try {
    await writeApi.close(); // flush + close
    console.log("InfluxDB write API closed");
  } catch (err) {
    console.error(" Error closing Influx:", err);
  }

  process.exit(0);
}

// Handle multiple exit signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", shutdown);

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});