const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://test.mosquitto.org");

const TOPIC = "sentinelgrid/sensor/data";

client.on("connect", () => {
  console.log(" Connected to MQTT Broker");

  client.subscribe(TOPIC, (err) => {
    if (!err) {
      console.log(`Subscribed to ${TOPIC}`);
    } else {
      console.error(" Subscription error:", err);
    }
  });
});

client.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    console.log("\n Incoming Sensor Data:");
    console.log(data);
  } catch (err) {
    console.error("❌ Invalid JSON received");
  }
});