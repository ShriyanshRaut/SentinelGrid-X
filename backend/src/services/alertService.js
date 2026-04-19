const pool = require("../db/postgres");

async function createAlert(data) {
  const query = `
    INSERT INTO alerts (gas, temp, vibration, status, timestamp)
    VALUES ($1, $2, $3, $4, $5)
  `;

  const values = [
    data.gas ?? 0,
    data.temp ?? 0,         // prevents null from entering DB
    data.vibration ?? 0,
    data.status,
    data.timestamp,
  ];

  await pool.query(query, values);
}

module.exports = { createAlert };