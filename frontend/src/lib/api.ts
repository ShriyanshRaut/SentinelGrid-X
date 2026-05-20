export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export type SensorReading = {
  id?: string | number;
  sensorId?: string;

  gas?: number;
  temp?: number;
  vibration?: number;

  status?: "NORMAL" | "HIGH" | "MEDIUM" | string;

  timestamp: string;

  mlScore?: number;
  mlRisk?: "HIGH" | "MEDIUM" | "LOW" | string;
  mlAnomaly?: boolean;
};

export type AlertItem = {
  id?: string | number;
  sensorId?: string;
  message?: string;

  gas?: number;
  temp?: number;
  vibration?: number;

  status?: "HIGH" | "MEDIUM" | "LOW" | string;

  timestamp: string;

  mlScore?: number;
  mlRisk?: "HIGH" | "MEDIUM" | "LOW" | string;
  mlAnomaly?: boolean;
};

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  const data = await res.json();
  return data as T;
}

export const fetchSensors = async (): Promise<SensorReading[]> => {
  const data = await request<SensorReading[]>("/sensors");

  return data
    .filter(
      (s) =>
        s &&
        typeof s.timestamp === "string" &&
        (typeof s.gas === "number" ||
          typeof s.temp === "number" ||
          typeof s.vibration === "number")
    )
    .map((s) => ({
      id: s.id,
      sensorId: s.sensorId,

      gas: s.gas,
      temp: s.temp,
      vibration: s.vibration,

      status: s.status,

      mlScore: s.mlScore,
      mlRisk: s.mlRisk,
      mlAnomaly: s.mlAnomaly,

      timestamp: s.timestamp,
    }));
};

export const fetchAlerts = async (): Promise<AlertItem[]> => {
  const data = await request<AlertItem[]>("/alerts");

  return data
    .filter(
      (a) =>
        a &&
        typeof a.timestamp === "string"
    )
    .map((a) => ({
      id: a.id,
      sensorId: a.sensorId,
      message: a.message,

      gas: a.gas,
      temp: a.temp,
      vibration: a.vibration,

      status: a.status,

      mlScore: a.mlScore,
      mlRisk: a.mlRisk,
      mlAnomaly: a.mlAnomaly,

      timestamp: a.timestamp,
    }));
};

export function formatTimestamp(ts: string): string {
  const d = new Date(ts.endsWith("Z") ? ts : ts + "Z");

  if (isNaN(d.getTime())) return ts;

  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }) + " IST";
}