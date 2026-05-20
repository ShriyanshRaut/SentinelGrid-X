const axios = require("axios");

const ML_URL = "http://127.0.0.1:8000/predict";

async function getMLPrediction(sensorData) {
  try {
    const response = await axios.post(ML_URL, {
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