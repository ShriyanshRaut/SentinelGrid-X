import { AlertOctagon } from "lucide-react";
import type { AlertItem } from "@/lib/api";
import { formatTimestamp } from "@/lib/api";

interface AlertCardProps {
  alert: AlertItem;
}

const AlertCard = ({ alert }: AlertCardProps) => {
  return (
    <div className="relative glass rounded-2xl p-6 border border-destructive/40 bg-destructive/5 hover:-translate-y-1 transition-transform duration-500">
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: "0 0 40px -10px hsl(0 90% 62% / 0.45) inset" }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono border text-destructive bg-destructive/10 border-destructive/40">
            <AlertOctagon className="h-3 w-3" />
            HIGH RISK
          </span>

          <span className="h-2.5 w-2.5 rounded-full bg-destructive animate-pulse-ring" />
        </div>

        {/* ✅ FIXED TITLE */}
        <h3 className="font-display font-semibold text-lg mb-1">
          Critical reading on sensor
        </h3>

        <p className="text-xs font-mono text-muted-foreground mb-4">
          {formatTimestamp(alert.timestamp)}
        </p>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <Stat label="Gas" value={alert.gas} unit="ppm" />
          <Stat label="Temp" value={alert.temp} unit="°C" />
          <Stat label="Vib" value={alert.vibration} unit="g" />
        </div>
      </div>
    </div>
  );
};

const Stat = ({
  label,
  value,
  unit,
}: {
  label: string;
  value?: number;
  unit: string;
}) => (
  <div className="rounded-lg bg-background/40 border border-border p-2.5">
    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
    <p className="font-display text-base font-bold text-foreground">
      {typeof value === "number" ? value.toFixed(1) : "--"}
      <span className="text-[10px] text-muted-foreground font-mono ml-1">
        {unit}
      </span>
    </p>
  </div>
);

export default AlertCard;