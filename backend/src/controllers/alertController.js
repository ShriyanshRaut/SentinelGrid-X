const pool = require("../db/postgres");

async function getAlerts(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50"
    );

    //  Debug once (you can remove later)
    console.log("ALERT ROW:", result.rows[0]);

    //  Normalize data strictly (no guessing)
    const formatted = result.rows.map((row) => ({
      id: row.id,
      gas: row.gas,
      temp: row.temp,              // exact DB field
      vibration: row.vibration,
      status: row.status,
      timestamp: row.timestamp,
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