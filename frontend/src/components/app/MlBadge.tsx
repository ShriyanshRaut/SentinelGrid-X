import { Brain, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";

interface MlBadgeProps {
  risk?: string;
  score?: number;
  anomaly?: boolean;
  compact?: boolean;
}

const riskStyle = (risk?: string) => {
  const r = String(risk ?? "").toUpperCase();
  if (r === "HIGH") return "text-destructive bg-destructive/10 border-destructive/40";
  if (r === "MEDIUM") return "text-warning bg-warning/10 border-warning/40";
  if (r === "LOW") return "text-success bg-success/10 border-success/40";
  return "text-muted-foreground bg-muted/30 border-border";
};

const MlBadge = ({ risk, score, anomaly, compact }: MlBadgeProps) => {
  if (risk == null && score == null && anomaly == null) return null;
  const r = String(risk ?? "").toUpperCase();
  const Icon = r === "HIGH" ? ShieldAlert : r === "LOW" ? ShieldCheck : Brain;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {risk != null && (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${riskStyle(risk)}`}
          title="ML risk classification"
        >
          <Icon className="h-3 w-3" />
          ML {r || "—"}
        </span>
      )}
      {typeof score === "number" && !compact && (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono border border-border bg-background/40 text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          {score.toFixed(2)}
        </span>
      )}
      {anomaly && (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-secondary/40 bg-secondary/10 text-secondary animate-pulse-ring">
          ⚠ anomaly
        </span>
      )}
    </div>
  );
};

export default MlBadge;
