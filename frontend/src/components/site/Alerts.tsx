import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { fetchAlerts, type AlertItem } from "@/lib/api";

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts()
      .then((res) => {
        setAlerts(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="alerts" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-bold mb-10 text-center">
          Alerts
        </h2>

        {loading ? (
          <p className="text-center">Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No alerts 🚀
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {alerts.map((a, i) => (
              <div
                key={i}
                className="rounded-xl border p-5 bg-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="text-red-500" />
                  <span className="font-semibold">
                    {a.risk || "ALERT"}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  Gas: {a.gas ?? "--"} | Temp: {a.temperature ?? "--"} |
                  Vib: {a.vibration ?? "--"}
                </p>

                <p className="text-xs text-muted-foreground">
                  {new Date(a.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Alerts;
