function isValidSensorData(data) {
  return (
    typeof data.gas === "number" &&
    typeof data.temp === "number" &&
    (data.vibration === 0 || data.vibration === 1) &&
    !isNaN(Date.parse(data.timestamp))
  );
}

module.exports = { isValidSensorData };