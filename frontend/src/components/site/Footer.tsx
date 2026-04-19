import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border mt-12">
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
              <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold text-lg">
              Sentinel<span className="text-gradient">Grid</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Real-time safety intelligence for the industrial world. Monitor everything. Miss nothing.
          </p>
        </div>
        <div>
          <p className="font-display font-semibold text-sm mb-3">Product</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#dashboard" className="hover:text-foreground">Dashboard</a></li>
            <li><a href="#alerts" className="hover:text-foreground">Alerts</a></li>
            <li><a href="#about" className="hover:text-foreground">How it works</a></li>
          </ul>
        </div>
        <div>
          <p className="font-display font-semibold text-sm mb-3">Company</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">About</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} SentinelGrid. All rights reserved.</span>
          <span className="font-mono">v1.0 · status: operational</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
