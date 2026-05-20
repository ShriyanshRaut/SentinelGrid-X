const mqtt = require("mqtt");
const { isValidSensorData } = require("../utils/validator");
const { formatSensorData } = require("../utils/formatter");
const { writeSensorData } = require("../db/influx");
const { createAlert } = require("../services/alertService");
const { getMLPrediction } = require("../services/mlService");
const logger = require("../utils/logger");

const MQTT_BROKER =
  process.env.MQTT_BROKER || "wss://broker.hivemq.com:8884/mqtt";

const TOPIC =
  process.env.MQTT_TOPIC || "sentinelgrid/shriyansh/device1";

let lastTimestamp = null;

const client = mqtt.connect(MQTT_BROKER, {
  reconnectPeriod: 1000,
});

console.log("MQTT Subscriber starting...");

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

    console.log("RAW MQTT:", data);

    if (packet.retain) {
      return;
    }

    if (!isValidSensorData(data)) {
      logger.error("Invalid sensor data received", data);
      return;
    }

    const formattedData = formatSensorData(data);

    const mlResult = await getMLPrediction(formattedData);

    console.log("ML Prediction:", mlResult);

    formattedData.mlScore = mlResult.score;
    formattedData.mlRisk = mlResult.risk;
    formattedData.mlAnomaly = mlResult.anomaly;

    if (!formattedData.timestamp) {
      formattedData.timestamp = new Date().toISOString();
    }

    if (formattedData.timestamp === lastTimestamp) return;
    lastTimestamp = formattedData.timestamp;

    try {
      writeSensorData(formattedData);
      console.log("Written to Influx:", formattedData);
    } catch (err) {
      logger.error("Influx write failed", err);
    }

    logger.info(`STATUS: ${formattedData.status}`);
    logger.info(`ML RISK: ${formattedData.mlRisk}`);

    if (
      formattedData.mlScore > 0.05 ||
      formattedData.mlRisk === "HIGH" ||
      formattedData.mlRisk === "MEDIUM" ||
      formattedData.mlAnomaly === true
    ) {
      try {
        logger.warn(
          `NEW ALERT gas=${formattedData.gas}, temp=${formattedData.temp}, mlRisk=${formattedData.mlRisk}`
        );

        await createAlert({
          gas: formattedData.gas,
          temperature: formattedData.temp,
          vibration: formattedData.vibration,
          risk_level: formattedData.mlRisk,
          ml_score: formattedData.mlScore,
        });

        console.log("ALERT STORED");
      } catch (err) {
        logger.error("Failed to store alert", err);
      }
    }
  } catch (err) {
    logger.error("Invalid JSON received", err.message);
  }
});

client.on("error", (err) => {
  logger.error("MQTT Connection Error:", err);
});

client.on("reconnect", () => {
  logger.warn("Reconnecting to MQTT...");
});