require("dotenv").config();
const app = require("./app");
require("./mqtt/subscriber");

const { writeApi } = require("./db/influx");

const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});