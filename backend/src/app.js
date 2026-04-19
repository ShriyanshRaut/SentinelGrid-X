const express = require("express");
const cors = require("cors"); // 👈 ADD THIS

const app = express();

// Middleware
app.use(
  cors({
    origin: [
    "http://localhost:8080",
    "http://localhost:5173",
    "http://10.68.14.80:8080", // 👈 ADD THIS
  ],
    credentials: true,
  })
);

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