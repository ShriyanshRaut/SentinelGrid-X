const pool = require("../db/postgres");

async function createAlert(data) {
  const query = `
    INSERT INTO alerts (gas, temp, vibration, status)
    VALUES ($1, $2, $3, $4)
  `;

  const values = [
    data.gas ?? 0,
    data.temp ?? 0,
    data.vibration ?? 0,
    data.status,
  ];

  await pool.query(query, values);
}

module.exports = { createAlert };