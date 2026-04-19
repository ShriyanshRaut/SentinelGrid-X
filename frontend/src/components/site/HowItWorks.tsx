import { Radio, Network, Server, Database, Cpu, LayoutDashboard, ArrowRight } from "lucide-react";

const steps = [
  { icon: Radio, label: "Sensors", sub: "Gas · Temp · Vibration" },
  { icon: Network, label: "MQTT", sub: "Pub/Sub broker" },
  { icon: Server, label: "Backend", sub: "Node.js ingestion" },
  { icon: Database, label: "InfluxDB", sub: "Time-series store" },
  { icon: Cpu, label: "Risk Engine", sub: "Live scoring" },
  { icon: LayoutDashboard, label: "Dashboard", sub: "Real-time UI" },
];

const HowItWorks = () => {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-mono uppercase tracking-widest text-accent mb-3">How it works</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            From signal to <span className="text-gradient">action</span>, in milliseconds
          </h2>
        </div>

        <div className="relative glass rounded-3xl p-8 md:p-12 border-gradient">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-2 items-stretch">
            {steps.map((s, i) => (
              <div key={s.label} className="flex md:contents">
                <div className="flex-1 flex flex-col items-center text-center group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
                    <div className="relative h-14 w-14 rounded-xl bg-card border border-border grid place-items-center mb-3 group-hover:-translate-y-1 transition-transform">
                      <s.icon className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <p className="font-display font-semibold text-sm">{s.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{s.sub}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center text-muted-foreground/40">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
