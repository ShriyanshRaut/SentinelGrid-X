import { Flame, Thermometer, Waves } from "lucide-react";
import type { SensorReading } from "@/lib/api";
import { formatTimestamp } from "@/lib/api";

interface SensorCardProps {
  sensor: SensorReading;
}

const SensorCard = ({ sensor }: SensorCardProps) => {
  //  derive status from values (since sensors don't have status)
  const isHigh =
    (sensor.gas ?? 0) > 80 ||
    (sensor.temp ?? 0) > 50 ||
    (sensor.vibration ?? 0) > 1;

  // safe timestamp handling (prevents crashes)
  const timeLabel = sensor.timestamp
    ? sensor.timestamp.slice(11, 19)
    : "--:--:--";

  const fullTime = sensor.timestamp
    ? formatTimestamp(sensor.timestamp)
    : "No timestamp";

  return (
    <div className="glass rounded-2xl p-6 border-gradient hover:-translate-y-1 transition-transform duration-500">
      <div className="flex items-center justify-between mb-5">
        <div>
          {/*  short time */}
          <p className="font-mono text-xs text-muted-foreground">
            #{timeLabel}
          </p>

          {/*  full timestamp */}
          <p className="text-xs text-muted-foreground mt-1">
            {fullTime}
          </p>
        </div>

        {/*  status badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono border ${
            isHigh
              ? "text-destructive bg-destructive/10 border-destructive/30 animate-pulse-ring"
              : "text-success bg-success/10 border-success/30"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isHigh ? "bg-destructive" : "bg-success"
            }`}
          />
          {isHigh ? "HIGH" : "NORMAL"}
        </span>
      </div>

      {/* metrics */}
      <div className="grid grid-cols-3 gap-3">
        <Metric
          icon={<Flame className="h-4 w-4" />}
          label="Gas"
          value={sensor.gas}
          unit="ppm"
          color="hsl(217 100% 62%)"
        />
        <Metric
          icon={<Thermometer className="h-4 w-4" />}
          label="Temp"
          value={sensor.temp}
          unit="°C"
          color="hsl(265 90% 66%)"
        />
        <Metric
          icon={<Waves className="h-4 w-4" />}
          label="Vib"
          value={sensor.vibration}
          unit="g"
          color="hsl(190 95% 60%)"
        />
      </div>
    </div>
  );
};

const Metric = ({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value?: number;
  unit: string;
  color: string;
}) => (
  <div className="rounded-xl bg-card/60 border border-border p-3">
    <div
      className="flex items-center gap-1.5 mb-1.5 text-muted-foreground"
      style={{ color }} // (fine for now, ignore ESLint warning)
    >
      {icon}
      <span className="text-[10px] font-mono uppercase tracking-wider">
        {label}
      </span>
    </div>

    <div className="flex items-baseline gap-1">
      <span className="font-display text-xl font-bold text-foreground">
        {typeof value === "number" ? value.toFixed(1) : "--"}
      </span>
      <span className="text-[10px] text-muted-foreground font-mono">
        {unit}
      </span>
    </div>
  </div>
);

export default SensorCard;