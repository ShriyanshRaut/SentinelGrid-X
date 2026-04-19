import { Activity, BellRing, BarChart3, Cpu } from "lucide-react";

const features = [
  { icon: Activity, title: "Real-time Monitoring", desc: "Stream telemetry from thousands of sensors with sub-second latency over MQTT.", accent: "from-primary to-accent" },
  { icon: BellRing, title: "Intelligent Alerts", desc: "Context-aware notifications routed to the right team via SMS, email, or webhook.", accent: "from-secondary to-primary" },
  { icon: BarChart3, title: "Data Visualization", desc: "Interactive charts for gas, temperature, and vibration with customizable dashboards.", accent: "from-accent to-secondary" },
  { icon: Cpu, title: "Risk Engine", desc: "Rules + heuristics evaluate every reading and assign a live risk score per asset.", accent: "from-primary to-secondary" },
];

const Features = () => {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-mono uppercase tracking-widest text-accent mb-3">Capabilities</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to <span className="text-gradient">stay ahead of failure</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group relative rounded-2xl glass p-6 hover:-translate-y-1 transition-all duration-500 border-gradient">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.accent} grid place-items-center mb-5 shadow-glow`}>
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
