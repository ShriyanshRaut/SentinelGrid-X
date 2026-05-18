const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

const alertRoutes = require("./routes/alertRoutes");
const sensorRoutes = require("./routes/sensorRoutes");

app.get("/", (req, res) => {
  res.send("SentinelGrid Backend Running");
});

app.use("/api/alerts", alertRoutes);
app.use("/api/sensors", sensorRoutes);

module.exports = app;