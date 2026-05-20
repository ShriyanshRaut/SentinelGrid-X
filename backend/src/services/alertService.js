const pool = require("../db/postgres");

async function createAlert(data) {
  const query = `
    INSERT INTO alerts (
      gas,
      temp,
      vibration,
      status,
      timestamp,
      ml_score,
      ml_risk,
      ml_anomaly
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  const values = [
    data.gas ?? 0,
    data.temp ?? 0,
    data.vibration ?? 0,
    data.status,
    data.timestamp,
    data.mlScore ?? 0,
    data.mlRisk ?? "UNKNOWN",
    data.mlAnomaly ?? false,
  ];

  await pool.query(query, values);
}

module.exports = { createAlert };