import { useEffect, useState } from "react";
import AppShell from "@/components/app/AppShell";
import AlertCard from "@/components/app/AlertCard";
import StateMessage from "@/components/app/StateMessage";
import { fetchAlerts, type AlertItem } from "@/lib/api";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setError(null);
        const data = await fetchAlerts();
        if (!cancelled) setAlerts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const highRisk = alerts.filter((a) => String(a.status).toUpperCase() === "HIGH");

  return (
    <AppShell
      title="High-risk alerts"
      subtitle="Showing only critical events that require immediate attention."
    >
      {loading && alerts.length === 0 ? (
        <StateMessage variant="loading" />
      ) : error ? (
        <StateMessage variant="error" message={error} />
      ) : highRisk.length === 0 ? (
        <StateMessage
          variant="empty"
          title="All clear"
          message="No high-risk alerts at the moment."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {highRisk.map((a, i) => (
            <AlertCard key={a.id ?? i} alert={a} />
          ))}
        </div>
      )}
    </AppShell>
  );
};

export default AlertsPage;
