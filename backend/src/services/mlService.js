const axios = require("axios");

const ML_URL = process.env.ML_SERVICE_URL;

async function getMLPrediction(sensorData) {
  try {
    const response = await axios.post(`${ML_URL}/predict`, {
      gas: sensorData.gas,
      temp: sensorData.temp,
      vibration: sensorData.vibration,
    });

    return response.data;

  } catch (error) {
    console.error("ML Service Error:", error.message);

    return {
      anomaly: false,
      score: 0,
      risk: "UNKNOWN",
    };
  }
}

module.exports = { getMLPrediction };