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
import { fetchAlerts, fetchSensors, type AlertItem, type SensorReading } from "@/lib/api";

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
        const [s, a] = await Promise.all([fetchSensors(), fetchAlerts()]);
        if (!cancelled) {
          setSensors(Array.isArray(s) ? s : []);
          setAlerts(Array.isArray(a) ? a : []);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
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
    if (sensors.length === 0) {
      return { avgGas: "—", avgTemp: "—", avgVib: "—", chartData: [] };
    }
    const sum = sensors.reduce(
      (acc, s) => ({
        gas: acc.gas + (Number(s.gas) || 0),
        temp: acc.temp + (Number(s.temp) || 0),
        vib: acc.vib + (Number(s.vibration) || 0),
      }),
      { gas: 0, temp: 0, vib: 0 },
    );
    const n = sensors.length;
    const sorted = [...sensors].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    const chart = sorted.map((s, i) => ({
      t: new Date(s.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || `#${i}`,
      gas: Number(s.gas) || 0,
      temperature: Number(s.temp) || 0,
      vibration: Number(s.vibration) || 0,
    }));
    return {
      avgGas: (sum.gas / n).toFixed(1),
      avgTemp: (sum.temp / n).toFixed(1),
      avgVib: (sum.vib / n).toFixed(2),
      chartData: chart,
    };
  }, [sensors]);

  const totalAlerts = alerts.length;

  if (loading && sensors.length === 0) {
    return (
      <AppShell title="Dashboard" subtitle="Operational overview across all monitored facilities.">
        <StateMessage variant="loading" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Dashboard" subtitle="Operational overview across all monitored facilities.">
        <StateMessage variant="error" message={error} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard" subtitle="Operational overview across all monitored facilities.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={Flame} label="Avg gas (CH₄)" value={avgGas} unit="ppm" accent="hsl(217 100% 62%)" />
        <StatCard icon={Thermometer} label="Avg temperature" value={avgTemp} unit="°C" accent="hsl(265 90% 66%)" />
        <StatCard icon={Waves} label="Avg vibration" value={avgVib} unit="g" accent="hsl(190 95% 60%)" />
        <StatCard icon={Bell} label="Total alerts" value={totalAlerts} accent="hsl(0 90% 62%)" />
      </div>

      {chartData.length === 0 ? (
        <StateMessage variant="empty" message="No telemetry available to chart yet." />
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          <ChartPanel title="Gas over time" dataKey="gas" data={chartData} color="hsl(217 100% 62%)" unit="ppm" />
          <ChartPanel title="Temperature over time" dataKey="temperature" data={chartData} color="hsl(265 90% 66%)" unit="°C" />
          <ChartPanel title="Vibration over time" dataKey="vibration" data={chartData} color="hsl(190 95% 60%)" unit="g" />
        </div>
      )}
    </AppShell>
  );
};

interface ChartPanelProps {
  title: string;
  dataKey: "gas" | "temperature" | "vibration";
  data: Array<{ t: string; gas: number; temperature: number; vibration: number }>;
  color: string;
  unit: string;
}

const ChartPanel = ({ title, dataKey, data, color, unit }: ChartPanelProps) => (
  <div className="glass rounded-2xl p-6 border-gradient">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display font-semibold text-base">{title}</h3>
      <span className="text-xs font-mono text-muted-foreground">{unit}</span>
    </div>
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(232 25% 16%)" strokeDasharray="3 3" />
          <XAxis dataKey="t" tick={{ fill: "hsl(220 15% 65%)", fontSize: 10 }} stroke="hsl(232 25% 20%)" />
          <YAxis tick={{ fill: "hsl(220 15% 65%)", fontSize: 10 }} stroke="hsl(232 25% 20%)" />
          <Tooltip
            contentStyle={{
              background: "hsl(232 32% 8%)",
              border: "1px solid hsl(232 25% 16%)",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "hsl(220 15% 65%)" }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default DashboardPage;
