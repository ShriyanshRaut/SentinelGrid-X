const mqtt = require("mqtt");
const { isValidSensorData } = require("../utils/validator");
const { formatSensorData } = require("../utils/formatter");
const { writeSensorData } = require("../db/influx");
const logger = require("../utils/logger"); //  logger added

const client = mqtt.connect("mqtt://test.mosquitto.org");

const TOPIC = "sentinelgrid/sensor/data";

client.on("connect", () => {
  logger.info("Connected to MQTT Broker");

  client.subscribe(TOPIC, (err) => {
    if (!err) {
      logger.info(`Subscribed to topic: ${TOPIC}`);
    } else {
      logger.error("Subscription error", err);
    }
  });
});

client.on("message", (topic, message) => {
  //  Gate 1: Topic filter
  if (topic !== TOPIC) return;

  try {
    const data = JSON.parse(message.toString());

    //  Gate 2: Validation
    if (!isValidSensorData(data)) {
      logger.error("Invalid sensor data received", data);
      return;
    }

    //  Gate 3: Formatting
    const formattedData = formatSensorData(data);

    //  Gate 4: Store in InfluxDB
    writeSensorData(formattedData);

    //  Structured log
    logger.info("Sensor data stored successfully", formattedData);

  } catch (err) {
    logger.error("Invalid JSON received", err.message);
  }
});