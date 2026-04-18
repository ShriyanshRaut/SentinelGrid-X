const mqtt = require("mqtt");
const { isValidSensorData } = require("../utils/validator");
const { formatSensorData } = require("../utils/formatter");

const client = mqtt.connect("mqtt://test.mosquitto.org");

const TOPIC = "sentinelgrid/sensor/data";

client.on("connect", () => {
  console.log(" Connected to MQTT Broker");

  client.subscribe(TOPIC, (err) => {
    if (!err) {
      console.log(` Subscribed to ${TOPIC}`);
    } else {
      console.error(" Subscription error:", err);
    }
  });
});

client.on("message", (topic, message) => {
  // 🚧 Gate 1: Topic filter
  if (topic !== TOPIC) return;

  try {
    const data = JSON.parse(message.toString());

    // Gate 2: Validation
    if (!isValidSensorData(data)) {
      console.error(" Invalid sensor data:", data);
      return;
    }

    //  Gate 3: Formatting
    const formattedData = formatSensorData(data);

    console.log("\n Formatted Sensor Data:");
    console.log(formattedData);

  } catch (err) {
    console.error(" Invalid JSON received");
  }
});