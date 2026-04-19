import { Flame, Thermometer, Waves } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { fetchSensors, type SensorReading } from "@/lib/api";

const sparkline = (seed: number, color: string) => {
  const points = Array.from({ length: 24 }, (_, i) => {
    const y =
      30 +
      Math.sin(i * 0.6 + seed) * 12 +
      Math.cos(i * 0.3 + seed * 2) * 6;
    return `${(i / 23) * 100},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 60" className="w-full h-20">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

const Dashboard = () => {
  const [data, setData] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const load = () => {
      fetchSensors()
        .then((res) => {
          setData(Array.isArray(res) ? res : []);
          setLastUpdated(new Date());
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    load();

    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🧠 FIX: always get VALID + LATEST sensor safely
  const latest = useMemo(() => {
    const valid = data.filter(
      (s) =>
        typeof s.gas === "number" &&
        typeof s.temp === "number" &&
        typeof s.vibration === "number" &&
        s.timestamp
    );

    if (valid.length === 0) return null;

    return [...valid].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )[0];
  }, [data]);

  const metrics = [
    {
      icon: Flame,
      label: "Gas (CH₄)",
      value: latest?.gas != null ? latest.gas.toFixed(1) : "--",
      unit: "ppm",
      color: "hsl(217 100% 62%)",
      seed: 1,
    },
    {
      icon: Thermometer,
      label: "Temperature",
      // ✅ FIXED HERE
      value: latest?.temp != null ? latest.temp.toFixed(1) : "--",
      unit: "°C",
      color: "hsl(265 90% 66%)",
      seed: 2,
    },
    {
      icon: Waves,
      label: "Vibration",
      value:
        latest?.vibration != null
          ? latest.vibration.toFixed(2)
          : "--",
      unit: "g",
      color: "hsl(190 95% 60%)",
      seed: 3,
    },
  ];

  return (
    <section id="dashboard" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold">Live Sensor Data</h2>

          <div className="text-sm text-muted-foreground">
            {lastUpdated
              ? `Updated: ${lastUpdated.toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}`
              : "Loading..."}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">
            Loading...
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl bg-card border p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <m.icon className="h-5 w-5" />
                  <span>{m.label}</span>
                </div>

                <div className="text-3xl font-bold">
                  {m.value} {m.unit}
                </div>

                {sparkline(m.seed, m.color)}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;