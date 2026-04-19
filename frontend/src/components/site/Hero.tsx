import { Button } from "@/components/ui/button";
import { ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-grid.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative pt-36 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-glow pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Live monitoring · 99.99% uptime
          </div>

          <h1 className="font-display font-bold tracking-tight text-5xl md:text-7xl leading-[1.05] mb-6">
            Monitor Industrial Risk<br />
            Before It Becomes <span className="text-gradient">Disaster</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            <span className="text-foreground font-medium">SentinelGrid</span> is a real-time safety intelligence platform —
            tracking gas, temperature, and vibration across your facility, every millisecond.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow group h-12 px-7">
              <Link to="/dashboard">
                View Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-7 border-border bg-card/50 hover:bg-card">
              <a href="#about">Learn More</a>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-accent" /> Sub-second alerts</div>
            <div className="hidden sm:flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-secondary" /> 10k+ sensors</div>
            <div className="hidden sm:flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-primary" /> ISO 27001</div>
          </div>
        </div>

        <div className="relative mt-20 mx-auto max-w-6xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="absolute -inset-4 bg-gradient-hero opacity-30 blur-3xl rounded-3xl" />
          <div className="relative rounded-2xl border border-border overflow-hidden shadow-elevated border-gradient">
            <img src={heroImg} alt="SentinelGrid real-time monitoring dashboard" width={1536} height={1024} className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
