import { useEffect, useMemo, useState } from "react";
import { Flame, Thermometer, Bell, Waves, BrainCircuit } from "lucide-react";
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
        if (!cancelled) {
          setLoading(false);
        }
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
    const validSensors = sensors.filter(
      (s) =>
        typeof s.gas === "number" &&
        typeof s.temp === "number" &&
        typeof s.vibration === "number" &&
        s.timestamp
    );

    if (validSensors.length === 0) {
      return {
        avgGas: "—",
        avgTemp: "—",
        avgVib: "—",
        chartData: [],
      };
    }

    const sum = validSensors.reduce(
      (acc, s) => ({
        gas: acc.gas + s.gas!,
        temp: acc.temp + s.temp!,
        vib: acc.vib + s.vibration!,
      }),
      { gas: 0, temp: 0, vib: 0 }
    );

    const n = validSensors.length;

    const sorted = [...validSensors].sort(
      (a, b) =>
        new Date(a.timestamp!).getTime() -
        new Date(b.timestamp!).getTime()
    );

    const chart = sorted.map((s) => ({
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

  const aiRisk = useMemo(() => {
    const all = [
      ...sensors.map((s) => ({
        risk: s.mlRisk,
        score: s.mlScore,
        anomaly: s.mlAnomaly,
      })),

      ...alerts.map((a) => ({
        risk: a.mlRisk,
        score: a.mlScore,
        anomaly: a.mlAnomaly,
      })),
    ];

    const buckets = {
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };

    let anomalies = 0;
    let totalScore = 0;
    let scoreCount = 0;

    all.forEach((x) => {
      const risk = String(x.risk ?? "").toUpperCase();

      if (risk === "CRITICAL" || risk === "HIGH") {
        buckets.HIGH++;
      } else if (risk === "MEDIUM") {
        buckets.MEDIUM++;
      } else {
        buckets.LOW++;
      }

      if (x.anomaly || risk === "CRITICAL") {
        anomalies++;
      }

      if (typeof x.score === "number") {
        totalScore += x.score;
        scoreCount++;
      }
    });

    return {
      buckets,
      anomalies,
      avgScore:
        scoreCount > 0
          ? (totalScore / scoreCount).toFixed(3)
          : "—",
    };
  }, [sensors, alerts]);

  const totalAlerts = alerts.length;

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

      <div className="glass rounded-2xl p-6 border-gradient mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold">
              AI Risk Intelligence
            </h2>

            <p className="text-sm text-muted-foreground">
              Live anomaly and ML risk analysis
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-xs font-mono text-muted-foreground mb-2">
              HIGH RISK
            </p>

            <p className="text-3xl font-bold text-destructive">
              {aiRisk.buckets.HIGH}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-xs font-mono text-muted-foreground mb-2">
              MEDIUM RISK
            </p>

            <p className="text-3xl font-bold text-yellow-400">
              {aiRisk.buckets.MEDIUM}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-xs font-mono text-muted-foreground mb-2">
              ANOMALIES
            </p>

            <p className="text-3xl font-bold text-primary">
              {aiRisk.anomalies}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-xs font-mono text-muted-foreground mb-2">
              AVG ML SCORE
            </p>

            <p className="text-3xl font-bold text-foreground">
              {aiRisk.avgScore}
            </p>
          </div>
        </div>
      </div>

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