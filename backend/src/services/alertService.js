const pool = require("../db/postgres");

async function createAlert(data) {
  const query = `
    INSERT INTO alerts (gas, temp, vibration, status, timestamp)
    VALUES ($1, $2, $3, $4, $5)
  `;

  const values = [
    data.gas,
    data.temp,
    data.vibration,
    data.status,
    data.timestamp,
  ];

  await pool.query(query, values);
}

module.exports = { createAlert };