const pool = require("../db/postgres");

async function getAlerts(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
}

module.exports = { getAlerts };