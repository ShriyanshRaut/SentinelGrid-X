import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  accent?: string;
}

const StatCard = ({ icon: Icon, label, value, unit, accent = "hsl(217 100% 62%)" }: StatCardProps) => {
  return (
    <div className="glass rounded-2xl p-6 border-gradient">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div
          className="h-9 w-9 rounded-lg grid place-items-center"
          style={{ background: `${accent}22` }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-bold">{value}</span>
        {unit && <span className="text-sm text-muted-foreground font-mono">{unit}</span>}
      </div>
    </div>
  );
};

export default StatCard;
