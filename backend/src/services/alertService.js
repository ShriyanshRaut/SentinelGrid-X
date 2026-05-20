const pool = require("../db/postgres");

async function createAlert(data) {
  const query = `
    INSERT INTO alerts (
      gas,
      temperature,
      vibration,
      risk_level,
      ml_score,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, NOW())
  `;

  const values = [
    data.gas ?? 0,
    data.temperature ?? 0,
    data.vibration ?? 0,
    data.risk_level ?? "UNKNOWN",
    data.ml_score ?? 0,
  ];

  await pool.query(query, values);
}

module.exports = { createAlert };