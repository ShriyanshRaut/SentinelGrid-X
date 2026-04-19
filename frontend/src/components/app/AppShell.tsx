import { Link, NavLink, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, Activity, Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sensors", label: "Sensors", icon: Activity },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const AppShell = ({ title, subtitle, children }: AppShellProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center glow">
              <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight hidden sm:inline">
              Sentinel<span className="text-gradient">Grid</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 glass rounded-full px-1.5 py-1.5">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                    active
                      ? "bg-gradient-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <Button asChild variant="ghost" size="sm" className="text-muted-foreground shrink-0">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
};

export default AppShell;
