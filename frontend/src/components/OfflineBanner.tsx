import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#fef3cd",
        color: "#856404",
        padding: "10px 24px",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        border: "1px solid #ffc107",
      }}
    >
      ⚠️ Немає з'єднання. Деякі дані можуть бути недоступні.
    </div>
  );
}