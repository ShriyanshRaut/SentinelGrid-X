// ---------------- CONFIG ----------------

export const API_BASE =
  import.meta.env.VITE_API_URL || "http://10.68.14.80:5000/api";

// ---------------- TYPES ----------------

export type SensorReading = {
  gas?: number;
  temp?: number; // matches backend
  vibration?: number;
  timestamp: string;
};

export type AlertItem = {
  id?: number;
  gas?: number;
  temp?: number;
  vibration?: number;
  status?: "HIGH" | "MEDIUM" | "LOW";
  timestamp: string;
};

// ---------------- CORE REQUEST ----------------

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  const data = await res.json();
  return data as T;
}

// ---------------- API ----------------

export const fetchSensors = async (): Promise<SensorReading[]> => {
  const data = await request<SensorReading[]>("/sensors");

  //  defensive filtering (prevents UI crashes)
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
      gas: s.gas,
      temp: s.temp,
      vibration: s.vibration,
      timestamp: s.timestamp,
    }));
};

// Alerts (already good)
export const fetchAlerts = async (): Promise<AlertItem[]> => {
  const data = await request<AlertItem[]>("/alerts");

  return data.filter(
    (a) =>
      a &&
      typeof a.timestamp === "string"
  );
};

// ---------------- UTILS ----------------

export function formatTimestamp(ts: string): string {
  // 👇 force treat as UTC
  const d = new Date(ts.endsWith("Z") ? ts : ts + "Z");

  if (isNaN(d.getTime())) return ts;

  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: true,
  });
}