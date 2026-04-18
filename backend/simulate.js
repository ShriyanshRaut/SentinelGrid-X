const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://test.mosquitto.org");

const TOPIC = "sentinelgrid/sensor/data";

client.on("connect", () => {
  console.log(" Simulator connected");

  setInterval(() => {
    const data = {
      gas: +(Math.random() * 100).toFixed(2),
      temp: +(20 + Math.random() * 10).toFixed(2),
      vibration: Math.random() > 0.8 ? 1 : 0,
      timestamp: new Date().toISOString(),
    };

    client.publish(TOPIC, JSON.stringify(data));

    console.log(" Sent:", data);
  }, 2000);
});