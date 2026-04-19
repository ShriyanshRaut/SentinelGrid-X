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
  const { gas, temp, vibration } = data;

  if (
    gas > 80 ||
    temp > 50 ||
    (vibration > 1 && gas > 60)
  ) {
    return "HIGH";
  } 
  else if (
    gas > 50 ||
    temp > 35
  ) {
    return "MEDIUM";
  } 
  else {
    return "NORMAL";
  }
}
module.exports = { formatSensorData };