import { useEffect, useMemo, useState } from "react";
import { Flame, Thermometer, Bell, Waves } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import AppShell from "@/components/app/AppShell";
import StatCard from "@/components/app/StatCard";
import StateMessage from "@/components/app/StateMessage";
import {
  fetchAlerts,
  fetchSensors,
  type AlertItem,
  type SensorReading,
} from "@/lib/api";

const DashboardPage = () => {
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError(null);

        const [s, a] = await Promise.all([
          fetchSensors(),
          fetchAlerts(),
        ]);

        if (!cancelled) {
          setSensors(Array.isArray(s) ? s : []);
          setAlerts(Array.isArray(a) ? a : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unknown error"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const { avgGas, avgTemp, avgVib, chartData } = useMemo(() => {
    // ✅ ONLY KEEP FULLY VALID SENSOR ROWS
    const validSensors = sensors.filter(
      (s) =>
        typeof s.gas === "number" &&
        typeof s.temp === "number" &&
        typeof s.vibration === "number" &&
        s.timestamp // also ensure timestamp exists
    );

    // ✅ IF NOTHING VALID → SAFE EMPTY STATE
    if (validSensors.length === 0) {
      return {
        avgGas: "—",
        avgTemp: "—",
        avgVib: "—",
        chartData: [],
      };
    }

    // ✅ SAFE SUM
    const sum = validSensors.reduce(
      (acc, s) => ({
        gas: acc.gas + s.gas!,
        temp: acc.temp + s.temp!,
        vib: acc.vib + s.vibration!,
      }),
      { gas: 0, temp: 0, vib: 0 }
    );

    const n = validSensors.length;

    // ✅ SORT BY TIME (SAFE)
    const sorted = [...validSensors].sort(
      (a, b) =>
        new Date(a.timestamp!).getTime() -
        new Date(b.timestamp!).getTime()
    );

    // ✅ BUILD CHART DATA
    const chart = sorted.map((s, i) => ({
      t: new Date(s.timestamp!).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      gas: s.gas!,
      temperature: s.temp!,
      vibration: s.vibration!,
    }));

    return {
      avgGas: (sum.gas / n).toFixed(1),
      avgTemp: (sum.temp / n).toFixed(1),
      avgVib: (sum.vib / n).toFixed(2),
      chartData: chart,
    };
  }, [sensors]);

  const totalAlerts = alerts.length;

  // ✅ LOADING
  if (loading && sensors.length === 0) {
    return (
      <AppShell
        title="Dashboard"
        subtitle="Operational overview across all monitored facilities."
      >
        <StateMessage variant="loading" />
      </AppShell>
    );
  }

  // ✅ ERROR
  if (error) {
    return (
      <AppShell
        title="Dashboard"
        subtitle="Operational overview across all monitored facilities."
      >
        <StateMessage variant="error" message={error} />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Dashboard"
      subtitle="Operational overview across all monitored facilities."
    >
      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={Flame}
          label="Avg gas (CH₄)"
          value={avgGas}
          unit="ppm"
          accent="hsl(217 100% 62%)"
        />
        <StatCard
          icon={Thermometer}
          label="Avg temperature"
          value={avgTemp}
          unit="°C"
          accent="hsl(265 90% 66%)"
        />
        <StatCard
          icon={Waves}
          label="Avg vibration"
          value={avgVib}
          unit="g"
          accent="hsl(190 95% 60%)"
        />
        <StatCard
          icon={Bell}
          label="Total alerts"
          value={totalAlerts}
          accent="hsl(0 90% 62%)"
        />
      </div>

      {/* CHARTS */}
      {chartData.length === 0 ? (
        <StateMessage
          variant="empty"
          message="No telemetry available to chart yet."
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          <ChartPanel
            title="Gas over time"
            dataKey="gas"
            data={chartData}
            color="hsl(217 100% 62%)"
            unit="ppm"
          />
          <ChartPanel
            title="Temperature over time"
            dataKey="temperature"
            data={chartData}
            color="hsl(265 90% 66%)"
            unit="°C"
          />
          <ChartPanel
            title="Vibration over time"
            dataKey="vibration"
            data={chartData}
            color="hsl(190 95% 60%)"
            unit="g"
          />
        </div>
      )}
    </AppShell>
  );
};

interface ChartPanelProps {
  title: string;
  dataKey: "gas" | "temperature" | "vibration";
  data: Array<{
    t: string;
    gas: number;
    temperature: number;
    vibration: number;
  }>;
  color: string;
  unit: string;
}

const ChartPanel = ({
  title,
  dataKey,
  data,
  color,
  unit,
}: ChartPanelProps) => (
  <div className="glass rounded-2xl p-6 border-gradient">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display font-semibold text-base">
        {title}
      </h3>
      <span className="text-xs font-mono text-muted-foreground">
        {unit}
      </span>
    </div>

    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid
            stroke="hsl(232 25% 16%)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="t"
            tick={{ fill: "hsl(220 15% 65%)", fontSize: 10 }}
          />
          <YAxis
            tick={{ fill: "hsl(220 15% 65%)", fontSize: 10 }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default DashboardPage;