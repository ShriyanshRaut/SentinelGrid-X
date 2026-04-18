const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Routes
const alertRoutes = require("./routes/alertRoutes");
const sensorRoutes = require("./routes/sensorRoutes");

// Health check
app.get("/", (req, res) => {
  res.send("SentinelGrid Backend Running 🚀");
});

// API routes
app.use("/api/alerts", alertRoutes);
app.use("/api/sensors", sensorRoutes);

module.exports = app;
