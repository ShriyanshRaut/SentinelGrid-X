import { Loader2, AlertTriangle, Inbox } from "lucide-react";

type Variant = "loading" | "error" | "empty";

interface StateMessageProps {
  variant: Variant;
  title?: string;
  message?: string;
}

const presets: Record<Variant, { title: string; message: string }> = {
  loading: { title: "Loading…", message: "Fetching live telemetry from the backend." },
  error: { title: "Couldn't load data", message: "Make sure the backend is running on localhost:5000." },
  empty: { title: "No data", message: "Nothing to display yet." },
};

const StateMessage = ({ variant, title, message }: StateMessageProps) => {
  const preset = presets[variant];
  const Icon = variant === "loading" ? Loader2 : variant === "error" ? AlertTriangle : Inbox;

  return (
    <div className="glass rounded-2xl p-12 text-center border-gradient">
      <div className="mx-auto h-12 w-12 rounded-full bg-muted grid place-items-center mb-4">
        <Icon
          className={`h-5 w-5 ${
            variant === "error" ? "text-destructive" : "text-muted-foreground"
          } ${variant === "loading" ? "animate-spin" : ""}`}
        />
      </div>
      <h3 className="font-display text-xl font-semibold mb-1">{title ?? preset.title}</h3>
      <p className="text-sm text-muted-foreground">{message ?? preset.message}</p>
    </div>
  );
};

export default StateMessage;
