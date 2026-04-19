const mqtt = require("mqtt");
const { isValidSensorData } = require("../utils/validator");
const { formatSensorData } = require("../utils/formatter");
const { writeSensorData } = require("../db/influx");
const { createAlert } = require("../services/alertService");
const logger = require("../utils/logger");

// Env config
const MQTT_BROKER =
  process.env.MQTT_BROKER || "mqtt://test.mosquitto.org";
const TOPIC =
  process.env.MQTT_TOPIC || "sentinelgrid/shriyansh/device1";

// 🧠 Prevent duplicate processing
let lastTimestamp = null;

const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
  logger.info(`Connected to MQTT Broker: ${MQTT_BROKER}`);

  client.subscribe(TOPIC, { qos: 0 }, (err) => {
    if (!err) {
      logger.info(`Subscribed to topic: ${TOPIC}`);
    } else {
      logger.error("Subscription error", err);
    }
  });
});

client.on("message", async (topic, message, packet) => {
  if (topic !== TOPIC) return;

  try {
    const raw = message.toString();
    const data = JSON.parse(raw);

    console.log("📡 RAW MQTT:", data);

    // 🧠 Ignore retained messages (important for public broker)
    if (packet.retain) {
      console.log("⚠️ Ignored retained message");
      return;
    }

    // Gate 2: Validation
    if (!isValidSensorData(data)) {
      logger.error("Invalid sensor data received", data);
      return;
    }

    // Gate 3: Formatting
    const formattedData = formatSensorData(data);

    // 🧠 Ensure timestamp exists
    if (!formattedData.timestamp) {
      formattedData.timestamp = new Date().toISOString();
    }

    // 🧠 Duplicate filter
    if (formattedData.timestamp === lastTimestamp) return;
    lastTimestamp = formattedData.timestamp;

    // Gate 4: InfluxDB
    try {
      writeSensorData(formattedData);
      console.log("📥 Written to Influx:", formattedData);
    } catch (err) {
      logger.error("Influx write failed", err);
    }

    logger.info(`STATUS: ${formattedData.status}`);

    // Gate 5: Alert Logic
    if (formattedData.status === "HIGH") {
      try {
        logger.warn(
          `🚨 NEW ALERT → gas=${formattedData.gas}, temp=${formattedData.temp}`
        );

        await createAlert(formattedData);
      } catch (err) {
        logger.error("Failed to store alert", err);
      }
    }
  } catch (err) {
    logger.error("Invalid JSON received", err.message);
  }
});

// Stability
client.on("error", (err) => {
  logger.error("MQTT Connection Error:", err);
});

client.on("reconnect", () => {
  logger.warn("Reconnecting to MQTT...");
});