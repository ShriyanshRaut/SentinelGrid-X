function formatSensorData(data) {
  const gas =
    typeof data.gas === "number" ? Number(data.gas.toFixed(2)) : null;

  const temp =
    typeof data.temp === "number" ? Number(data.temp.toFixed(2)) : null;

  const vibration =
    typeof data.vibration === "number" ? data.vibration : 0;

  return {
    gas,
    temp,
    vibration,

    // Safe timestamp handling
    timestamp: data.timestamp
      ? new Date(data.timestamp).toISOString()
      : new Date().toISOString(),

    // Derived status (safe inputs)
    status: getStatus({ gas, temp, vibration }),
  };
}

function getStatus(data) {
  const gas = data.gas ?? 0;
  const temp = data.temp ?? 0;
  const vibration = data.vibration ?? 0;

  if (
    gas > 80 ||
    temp > 50 ||
    (vibration > 1 && gas > 60)
  ) {
    return "HIGH";
  } else if (
    gas > 50 ||
    temp > 35
  ) {
    return "MEDIUM";
  } else {
    return "NORMAL";
  }
}

module.exports = { formatSensorData };