import { SiNodedotjs, SiMqtt, SiInfluxdb, SiPostgresql, SiDocker, SiTypescript, SiReact, SiVite, SiTailwindcss } from "react-icons/si";

const stack = [
  { name: "Node.js", desc: "Runtime", Icon: SiNodedotjs, color: "hsl(120 60% 55%)" },
  { name: "MQTT", desc: "Messaging", Icon: SiMqtt, color: "hsl(280 80% 65%)" },
  { name: "InfluxDB", desc: "Time-series", Icon: SiInfluxdb, color: "hsl(217 100% 62%)" },
  { name: "PostgreSQL", desc: "Relational", Icon: SiPostgresql, color: "hsl(200 70% 55%)" },
  { name: "Docker", desc: "Containers", Icon: SiDocker, color: "hsl(205 90% 60%)" },
  { name: "TypeScript", desc: "Language", Icon: SiTypescript, color: "hsl(211 60% 50%)" },
  { name: "React", desc: "UI", Icon: SiReact, color: "hsl(190 95% 60%)" },
  { name: "Vite", desc: "Tooling", Icon: SiVite, color: "hsl(265 90% 66%)" },
  { name: "Tailwind", desc: "Styling", Icon: SiTailwindcss, color: "hsl(190 80% 55%)" },
];

const TechStack = () => {
  // Duplicate the list so the marquee loops seamlessly
  const loop = [...stack, ...stack];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-mono uppercase tracking-widest text-accent mb-3">Tech stack</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Built on a <span className="text-gradient">battle-tested</span> foundation
          </h2>
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className="flex w-max gap-5 py-4 px-6"
          style={{ animation: "marquee 30s linear infinite" }}
        >
          {loop.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="glass rounded-2xl px-7 py-5 border-gradient hover:shadow-glow transition-shadow shrink-0 w-[200px] flex items-center gap-4"
            >
              <div
                className="h-11 w-11 rounded-xl grid place-items-center shrink-0"
                style={{ background: `${t.color}1f` }}
              >
                <t.Icon className="h-6 w-6" style={{ color: t.color }} />
              </div>
              <div className="text-left">
                <p className="font-display text-base font-semibold leading-tight">{t.name}</p>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
