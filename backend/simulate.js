const mqtt = require("mqtt");

const MQTT_BROKER = "wss://broker.hivemq.com:8884/mqtt";
const TOPIC = "sentinelgrid/shriyansh/device1";

const client = mqtt.connect(MQTT_BROKER, {
  reconnectPeriod: 1000,
});

console.log("Simulator starting...");

client.on("connect", () => {
  console.log("Simulator connected");

  setInterval(() => {
    const data = {
      gas: +(Math.random() * 100).toFixed(2),
      temp: +(20 + Math.random() * 10).toFixed(2),
      vibration: Math.random() > 0.8 ? 1 : 0,
      timestamp: new Date().toISOString(),
    };

    client.publish(TOPIC, JSON.stringify(data));
    console.log("Sent:", data);
  }, 2000);
});

client.on("error", (err) => {
  console.error("MQTT Error:", err.message);
});

client.on("reconnect", () => {
  console.log("Reconnecting...");
});