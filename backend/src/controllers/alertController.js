const pool = require("../db/postgres");

async function getAlerts(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 20"
    );

    console.log("Fetched alerts:", result.rows.length);

    const formatted = result.rows.map((row) => ({
      id: row.id,
      gas: row.gas,
      temp: row.temp,
      vibration: row.vibration,
      status: row.status,
      timestamp: new Date(row.timestamp).toISOString(), // ✅ FIXED
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching alerts:", err.message);

    res.status(500).json({
      error: "Failed to fetch alerts",
      details: err.message,
    });
  }
}

module.exports = { getAlerts };