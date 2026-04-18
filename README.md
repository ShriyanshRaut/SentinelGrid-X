<div align="center">

# SentinelGrid-X 🛡️

**AI-Powered IoT Infrastructure Monitoring System**

*Know before it breaks.*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![MQTT](https://img.shields.io/badge/MQTT-TLS%20Secured-660066?style=flat-square)](https://mqtt.org)

</div>

---

## What is SentinelGrid-X?

Most industrial monitoring systems rely on fixed thresholds — "alert if gas > 500 ppm." That works until it doesn't. A slow gas leak at 380 ppm combined with rising temperature and micro-vibrations in a pipe joint is just as dangerous, but no single threshold catches it.

SentinelGrid-X is built around that gap. It combines hardware sensor nodes (ESP32), a secure MQTT communication pipeline, a Node.js backend with a rule-based logic engine, and a Python ML service running Isolation Forest anomaly detection. The result is a system that understands *patterns*, not just numbers.

Data flows from physical sensors to a live React dashboard in under a second. When something looks wrong — whether a threshold is crossed or the ML model flags an unusual combination of readings — the system classifies the risk level and fires alerts automatically.

It was built as a student engineering project, but the architecture mirrors real industrial IoT deployments.

---

## How the Risk Engine Works

SentinelGrid-X uses a **two-signal decision model**:

**Signal 1 — Rule-based engine:** Hard thresholds are checked immediately on every incoming reading. If gas exceeds 500 ppm, or temperature crosses 80°C, a rule flag is raised. Fast, deterministic, zero latency.

**Signal 2 — ML anomaly score:** The Python service runs an Isolation Forest model trained on historical sensor data. It scores every reading between 0 and 1 based on how "isolated" (unusual) it is across all three sensor dimensions simultaneously. A reading can score high even if no individual threshold is crossed.

**Fusion:** The backend combines both signals:

| Rule Flag | ML Score     | Risk Level   |
|-----------|--------------|--------------|
| None      | < 0.5        | 🟢 Low        |
| None      | 0.5 – 0.7    | 🟡 Moderate   |
| Triggered | OR > 0.7     | 🟠 High       |
| Triggered | AND > 0.85   | 🔴 Critical   |

`Moderate` is only possible because of ML — it's the early warning that pure threshold systems cannot produce.

---

## Why Isolation Forest?

Isolation Forest is an unsupervised ML algorithm that detects outliers by measuring how quickly a data point can be isolated using random binary splits. Anomalies are "few and different" — they get isolated in 2–3 splits. Normal readings, sitting in dense clusters of similar data, need 8–12 splits.

For this system specifically:
- **No labeled training data needed** — we don't need historical examples of failures
- **Multi-sensor awareness** — scores are computed across gas + temperature + vibration together, not independently
- **Millisecond inference** — fast enough for real-time sensor streams
- **Works on normal-only training data** — the model learns what "normal" looks like and flags everything else

---

## Features

- 📡 500ms sensor polling from ESP32 nodes (gas, temperature, vibration)
- 🔐 MQTT over TLS with per-device certificate authentication
- 🧠 Dual-layer anomaly detection: rule engine + Isolation Forest
- ⚡ Sub-second latency from sensor to dashboard via Socket.io
- 📊 Live React dashboard with real-time charts and risk indicators
- 🚨 Multi-channel alerting: push notification + SMS on High/Critical
- 🗄️ Dual-database: InfluxDB (time-series) + PostgreSQL (users, alerts)
- ☁️ Fully containerized, deployable to any cloud VM

---

## System Architecture

```
┌──────────────────────┐
│     Edge Layer       │
│  ESP32 + Sensors     │  Gas · Temp · Vibration
│  (500ms poll cycle)  │
└──────────┬───────────┘
           │  MQTT over TLS
           ▼
┌──────────────────────┐
│  Secure Comms Layer  │
│  Mosquitto Broker    │  Device auth + certificate validation
└──────────┬───────────┘
           │  Authenticated data
           ▼
┌──────────────────────────────────────────────────┐
│                  Backend Layer                   │
│         Node.js + Express + mqtt.js              │
│                                                  │
│  ┌─────────────────┐    ┌──────────────────────┐ │
│  │  Rule Engine    │    │  REST API + Socket.io│ │
│  │  (thresholds)   │    │  (data distribution) │ │
│  └────────┬────────┘    └──────────────────────┘ │
│           │  + ML score                           │
│           ▼                                       │
│  ┌─────────────────┐                             │
│  │  Risk Classifier│  Low / Moderate / High /    │
│  │  (fusion logic) │  Critical                   │
│  └─────────────────┘                             │
└───┬──────────┬──────────────┬────────────────────┘
    │          │              │
    ▼          ▼              ▼
┌────────┐ ┌────────────┐ ┌──────────────────────┐
│InfluxDB│ │ PostgreSQL │ │   Python ML Service   │
│(metrics│ │(users,     │ │  Isolation Forest     │
│& logs) │ │ alerts)    │ │  → anomaly score      │
└────────┘ └────────────┘ └──────────┬───────────┘
                                      │ predictions
                                      ▼
                          ┌───────────────────────┐
                          │   Application Layer   │
                          │   React Dashboard     │
                          │   + Alert System      │
                          │   (SMS / Push)        │
                          └───────────────────────┘
```

---

## Tech Stack

| Layer            | Technologies                                                   |
|------------------|----------------------------------------------------------------|
| **Hardware**     | ESP32, MPU6050 (vibration), DHT22 (temp), MQ-2/MQ-135 (gas)  |
| **Comms**        | MQTT (Mosquitto), TLS 1.2, per-device certificates            |
| **Backend**      | Node.js, Express, mqtt.js, Socket.io, JWT auth                |
| **ML Service**   | Python, scikit-learn (Isolation Forest), FastAPI              |
| **Database**     | InfluxDB (time-series metrics), PostgreSQL (relational data)  |
| **Frontend**     | React.js, Recharts, WebSocket real-time updates               |
| **Deployment**   | Docker, Docker Compose, AWS EC2 / Azure VM                    |

---

## Project Structure

```
sentinelgrid/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # DB connection setup
│   │   │   └── mqtt.js             # MQTT broker config
│   │   ├── controllers/
│   │   │   ├── sensorController.js
│   │   │   └── alertController.js
│   │   ├── services/
│   │   │   ├── riskService.js      # Fusion logic (rules + ML)
│   │   │   └── mlService.js        # ML service HTTP client
│   │   │   ├── alertService.js
│   │   ├── routes/
│   │   │   ├── sensorRoutes.js
│   │   │   └── alertRoutes.js
│   │   ├── mqtt/
│   │   │   └── subscriber.js       # MQTT message handler
│   │   ├── db/
│   │   │   ├── influx.js
│   │   │   └── postgres.js
│   │   ├── utils/
│   │   │   ├── formatter.js
│   │   │   └── logger.js
│   │   │   └── validator.js
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── ml-service/
│   ├── app.py                      # FastAPI inference endpoint
│   ├── model/
│   │   ├── train.py                # Isolation Forest training
│   │   └── isolation_forest.pkl    # Serialized model
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/             # Sensor time-series charts
│   │   │   └── alerts/             # Alert panel + risk badges
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   └── App.js
│   └── package.json
│
├── firmware/
│   ├── main.ino
│   ├── mqtt_client.ino
│   ├── wifi_config.h
│   ├── config.h
│   └── sensors/
│       ├── gas_sensor.ino
│       ├── temp_sensor.ino
│       └── vibration_sensor.ino
│
├── sensor-processing/
│   ├── calibration/                # Per-sensor calibration scripts
│   ├── processing/                 # Signal filtering & ADC conversion
│   └── formatter/                  # JSON payload formatter
│
├── docker-compose.yml
└── README.md
```

---

## Data Flow

```
1. SENSE      →  ESP32 reads gas, temperature, and vibration every 500ms
2. FORMAT     →  Sensor values packaged as JSON payload
3. TRANSMIT   →  Payload published to MQTT broker over TLS
4. VALIDATE   →  Backend authenticates device and cleans incoming data
5. STORE      →  Raw readings written to InfluxDB
6. ANALYZE    →  Data forwarded to Python ML service → Isolation Forest scores it
7. DECIDE     →  Rule engine flag + ML score fused → Low / Moderate / High / Critical
8. PUSH       →  Risk level + data broadcast via Socket.io to dashboard
9. ALERT      →  If risk ≥ High: push notification and/or SMS dispatched
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18, Python ≥ 3.10
- Docker + Docker Compose
- PlatformIO (for ESP32 firmware flashing)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/sentinelgrid.git
cd sentinelgrid

# 2. Configure environment variables
cp backend/.env.example backend/.env
# Fill in: MQTT host, DB credentials, JWT secret, ML service URL

# 3. Start all services (backend, ML, DBs, broker)
docker-compose up --build

# 4. Train the ML model (first run only)
cd ml-service
pip install -r requirements.txt
python model/train.py

# 5. Flash the ESP32 firmware
# Open /firmware in PlatformIO
# Set WiFi credentials and MQTT broker IP in config.h
# Upload to device

# 6. Start the frontend
cd frontend
npm install
npm run dev
```

| Service        | URL                        |
|----------------|----------------------------|
| Dashboard      | http://localhost:3000       |
| Backend API    | http://localhost:4000       |
| ML Service     | http://localhost:8000       |
| InfluxDB UI    | http://localhost:8086       |

---

## Team

| Name        | Responsibility                          |
|-------------|------------------------------------------|
| **Shakti**  | Backend architecture & ML integration   |
| **Soham**   | React dashboard & real-time UI          |
| **Ekansh**  | Sensor integration & signal processing  |
| **Swayam**  | ESP32 firmware & MQTT communication     |

---

## Future Scope

- **Predictive maintenance** — shift from anomaly detection to failure forecasting using LSTM on time-series windows
- **Per-device ML models** — federated learning so each node trains locally without centralizing raw data
- **OTA firmware updates** — push config and calibration changes to ESP32 nodes remotely
- **Mobile app** — native push alerts with sensor history, beyond SMS
- **Multi-site support** — single dashboard managing distributed sensor grids across locations

---

## License

MIT — open to use, extend, and build on.

---

<div align="center">

**SentinelGrid-X — Know before it breaks.**

</div>
