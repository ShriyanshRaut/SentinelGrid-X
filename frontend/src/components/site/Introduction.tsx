import { AlertTriangle, ShieldCheck } from "lucide-react";

const Introduction = () => {
  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-mono uppercase tracking-widest text-accent mb-3">The problem</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Every second of delay is a <span className="text-gradient">risk multiplied</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-8 border-gradient">
            <div className="h-12 w-12 rounded-xl bg-destructive/10 grid place-items-center mb-5">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="font-display text-2xl font-semibold mb-3">The Problem</h3>
            <p className="text-muted-foreground leading-relaxed">
              Industrial sites face hidden hazards — gas leaks, overheating machinery, structural vibration.
              Manual checks and legacy SCADA systems detect problems too late, and delayed response costs lives,
              equipment, and millions in downtime.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 border-gradient">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center mb-5 shadow-glow">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-display text-2xl font-semibold mb-3">The Solution</h3>
            <p className="text-muted-foreground leading-relaxed">
              SentinelGrid streams sensor data through a high-throughput pipeline, evaluates risk
              continuously, and pushes intelligent alerts to the right people the moment thresholds
              are breached — turning raw telemetry into decisive action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
