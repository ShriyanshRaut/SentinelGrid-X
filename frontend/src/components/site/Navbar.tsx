import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { label: "Home", href: "#home", internal: false },
  { label: "Dashboard", href: "/dashboard", internal: true },
  { label: "Sensors", href: "/sensors", internal: true },
  { label: "Alerts", href: "/alerts", internal: true },
  { label: "About", href: "#about", internal: false },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
              <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              Sentinel<span className="text-gradient">Grid</span>
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                {l.internal ? (
                  <Link to={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                ) : (
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign in</Button>
            <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
              <Link to="/dashboard">Launch app</Link>
            </Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden glass mt-2 rounded-2xl p-5 flex flex-col gap-4">
            {links.map((l) =>
              l.internal ? (
                <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
                  {l.label}
                </a>
              ),
            )}
            <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground">
              <Link to="/dashboard" onClick={() => setOpen(false)}>Launch app</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
