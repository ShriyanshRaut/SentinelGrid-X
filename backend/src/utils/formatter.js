function formatSensorData(data) {
  return {
    gas: Number(data.gas.toFixed(2)),
    temp: Number(data.temp.toFixed(2)),
    vibration: data.vibration,

    // Standardized timestamp
    timestamp: new Date(data.timestamp).toISOString(),

    //  Derived fields 
    status: getStatus(data),
  };
}

// Simple rule-based status (temporary risk engine preview)
function getStatus(data) {
  if (data.gas > 70 || data.temp > 50 || data.vibration === 1) {
    return "HIGH";
  } else if (data.gas > 40 || data.temp > 35) {
    return "MEDIUM";
  } else {
    return "NORMAL";
  }
}

module.exports = { formatSensorData };