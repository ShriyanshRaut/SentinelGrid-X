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

## Overview

Most industrial monitoring systems rely on fixed thresholds — "alert if gas > 500 ppm." That works until it doesn't. A slow gas leak at 380 ppm combined with rising temperature and micro-vibrations in a pipe joint is just as dangerous, but no single threshold catches it.

SentinelGrid-X is built around that gap. It combines ESP32 sensor nodes, a secure MQTT communication pipeline, a Node.js backend with a rule-based risk engine, and a live React dashboard. Sensor data flows end-to-end in under a second — from hardware to browser.

When conditions cross risk thresholds, the system classifies severity and dispatches alerts automatically. Built as a student engineering project, but architected like a production IoT deployment.

---

## How the Risk Engine Works

Every incoming sensor reading passes through a **rule-based classification pipeline** in the backend:

1. The backend receives a validated MQTT payload (gas, temperature, vibration)
2. Each value is checked against configurable thresholds per sensor type
3. The number and severity of breached thresholds determine the final risk level
4. The result is stored in PostgreSQL and pushed live to the dashboard via Socket.io

| Conditions                        | Risk Level       |
|-----------------------------------|------------------|
| No thresholds breached            | 🟢 Low           |
| One sensor mildly elevated        | 🟡 Moderate      |
| One threshold breached            | 🟠 High          |
| Multiple thresholds breached      | 🔴 Critical      |

On `High` or `Critical`, the alert system fires immediately — no polling, no delay.

---

## Features

- 📡 Real-time sensor ingestion from ESP32 nodes via MQTT over TLS
- 🔐 Device-level authentication with Mosquitto broker + certificates
- ⚙️ Rule-based risk classification engine (gas, temperature, vibration)
- ⚡ Sub-second data delivery to dashboard via Socket.io
- 📊 Live React dashboard — sensor cards, alert feed, risk indicators
- 🚨 Automated alerting on High/Critical risk events
- 🗄️ InfluxDB for time-series sensor data, PostgreSQL for alerts and users
- ☁️ Fully containerized with Docker Compose

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
│  Mosquitto Broker    │  Certificate auth + TLS termination
└──────────┬───────────┘
           │  Validated payload
           ▼
┌──────────────────────────────────────────────────┐
│                  Backend Layer                   │
│         Node.js + Express + mqtt.js              │
│                                                  │
│  ┌──────────────────┐   ┌──────────────────────┐ │
│  │  MQTT Subscriber │──►│  Risk Engine         │ │
│  │  (subscriber.js) │   │  (riskService.js)    │ │
│  └──────────────────┘   └──────────┬───────────┘ │
│                                    │             │
│  ┌──────────────────┐   ┌──────────▼───────────┐ │
│  │  REST API        │   │  Alert Engine        │ │
│  │  (sensorRoutes,  │   │  (alertService.js)   │ │
│  │   alertRoutes)   │   └──────────────────────┘ │
│  └──────────────────┘                            │
│         │                     │                  │
└─────────┼─────────────────────┼──────────────────┘
          │                     │
    ┌─────▼──────┐       ┌──────▼──────┐
    │  InfluxDB  │       │ PostgreSQL  │
    │ (raw sensor│       │ (alerts,    │
    │  metrics)  │       │  users)     │
    └────────────┘       └─────────────┘
          │                     │
          └──────────┬──────────┘
                     │  Socket.io + REST
                     ▼
          ┌─────────────────────┐
          │   React Frontend    │
          │   Dashboard · Alerts│
          │   Sensors · Navbar  │
          └─────────────────────┘
```

---

## Tech Stack

| Layer          | Technologies                                                   |
|----------------|---------------------------------------------------------------|
| **Hardware**   | ESP32, MPU6050 (vibration), DHT22 (temp), MQ-2/MQ-135 (gas)   |
| **Comms**      | MQTT, Mosquitto broker, TLS 1.2, device certificates          |
| **Backend**    | Node.js, Express, mqtt.js, Socket.io, JWT, REST API           |
| **Database**   | InfluxDB (time-series sensor data), PostgreSQL (alerts/users) |
| **Frontend**   | React, TypeScript, Vite, Tailwind CSS, shadcn/ui              |
| **Deployment** | Docker, Docker Compose, AWS EC2 / Azure VM                    |

---

## Project Structure

```
sentinelgrid/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # InfluxDB + PostgreSQL init
│   │   │   └── mqtt.js               # Mosquitto broker config
│   │   │
│   │   ├── controllers/
│   │   │   ├── sensorController.js   # Handles sensor data endpoints
│   │   │   └── alertController.js    # Handles alert CRUD
│   │   │
│   │   ├── services/
│   │   │   ├── riskService.js        # Rule-based risk classification
│   │   │   ├── alertService.js       # Alert creation + dispatch
│   │   │   └── mlService.js          # ML service client (future)
│   │   │
│   │   ├── routes/
│   │   │   ├── sensorRoutes.js
│   │   │   └── alertRoutes.js
│   │   │
│   │   ├── mqtt/
│   │   │   └── subscriber.js         # MQTT message handler + parser
│   │   │
│   │   ├── db/
│   │   │   ├── influx.js             # InfluxDB write/query client
│   │   │   └── postgres.js           # PostgreSQL query client
│   │   │
│   │   ├── utils/
│   │   │   ├── formatter.js          # Payload normalization
│   │   │   ├── validator.js          # Incoming data validation
│   │   │   └── logger.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── ml-service/                       # Placeholder — Isolation Forest (future)
│   ├── app.py
│   ├── model/
│   │   ├── train.py
│   │   └── isolation_forest.pkl
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout wrapper
│   │   │   └── providers.tsx         # Global context providers
│   │   │
│   │   ├── pages/
│   │   │   ├── Index.tsx             # Landing / entry route
│   │   │   ├── DashboardPage.tsx     # Main monitoring view
│   │   │   ├── SensorsPage.tsx       # Per-sensor detail view
│   │   │   ├── AlertsPage.tsx        # Alert history + filters
│   │   │   └── NotFound.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.tsx     # Dashboard layout + grid
│   │   │   │   └── SensorCard.tsx    # Live sensor value card
│   │   │   │
│   │   │   ├── alerts/
│   │   │   │   ├── AlertCard.tsx     # Individual alert entry
│   │   │   │   └── AlertsList.tsx    # Alert feed container
│   │   │   │
│   │   │   ├── site/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Hero.tsx
│   │   │   │   └── Footer.tsx
│   │   │   │
│   │   │   └── common/
│   │   │       ├── Loader.tsx
│   │   │       └── EmptyState.tsx
│   │   │
│   │   ├── ui/                       # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSensors.ts         # Sensor data fetching + socket sub
│   │   │   └── useAlerts.ts          # Alert fetching + real-time updates
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                # Axios/fetch API client
│   │   │   └── utils.ts              # Shared helpers (cn, formatters)
│   │   │
│   │   └── styles/
│   │       └── globals.css
│   │
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
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
│   ├── calibration/                  # Per-sensor calibration scripts
│   ├── processing/                   # Signal filtering & ADC conversion
│   └── formatter/                    # JSON payload formatter
│
├── docker-compose.yml
└── README.md
```

---

## Data Flow

```
1. SENSE      →  ESP32 reads gas, temperature, vibration every 500ms
2. FORMAT     →  Sensor values packaged into a JSON payload
3. TRANSMIT   →  Payload published to Mosquitto broker over MQTT/TLS
4. RECEIVE    →  subscriber.js picks up the message, validates the payload
5. CLASSIFY   →  riskService.js runs threshold checks → risk level assigned
6. STORE      →  Raw readings → InfluxDB  |  Alerts → PostgreSQL
7. BROADCAST  →  Socket.io pushes risk level + sensor data to all clients
8. RENDER     →  React dashboard updates sensor cards and alert feed live
9. ALERT      →  If risk ≥ High: alert record created, notification dispatched
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18, Python ≥ 3.10
- Docker + Docker Compose
- PlatformIO (for ESP32 firmware flashing)
- Bun or npm (frontend)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/sentinelgrid.git
cd sentinelgrid

# 2. Configure environment variables
cp backend/.env.example backend/.env
# Edit .env — set MQTT host, InfluxDB/PostgreSQL credentials, JWT secret

# 3. Start all backend services
docker-compose up --build
# Starts: Node.js backend, Mosquitto broker, InfluxDB, PostgreSQL

# 4. Start the frontend
cd frontend
bun install       # or: npm install
bun run dev       # or: npm run dev
```

```bash
# 5. Flash ESP32 firmware (requires PlatformIO)
# Open /firmware in VS Code with PlatformIO extension
# Set your WiFi SSID, password, and MQTT broker IP in config.h
# Then: pio run --target upload
```

| Service        | URL                         |
|----------------|-----------------------------|
| Dashboard      | http://localhost:5173        |
| Backend API    | http://localhost:4000        |
| InfluxDB UI    | http://localhost:8086        |

---

## Team

| Name        | Responsibility                          |
|-------------|------------------------------------------|
| **Shakti**  | Backend architecture & risk engine      |
| **Soham**   | React dashboard & real-time UI          |
| **Ekansh**  | Sensor integration & signal processing  |
| **Swayam**  | ESP32 firmware & MQTT communication     |

---

## Future Scope

- **ML anomaly detection** — Isolation Forest layer on top of the rule engine for multi-sensor pattern recognition
- **Predictive maintenance** — LSTM-based failure forecasting on InfluxDB time-series windows
- **OTA firmware updates** — push calibration and config changes to ESP32 nodes remotely
- **Mobile app** — native push alerts with sensor history on-device
- **Multi-site support** — single dashboard managing distributed sensor grids

---

## License

MIT — open to use, extend, and build on.

---

<div align="center">

**SentinelGrid-X — Know before it breaks.**

</div>
