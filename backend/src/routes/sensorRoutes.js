const express = require("express");
const router = express.Router();
const { getSensorData } = require("../controllers/sensorController");

router.get("/", getSensorData);

module.exports = router;