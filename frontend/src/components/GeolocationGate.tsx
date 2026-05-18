import { useState, useEffect, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { requestGeolocation } from "../store/geolocation";

interface Props {
  children: ReactNode;
}

export default function GeolocationGate({ children }: Props) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s) => s.geolocation);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(requestGeolocation());
    }
  }, [status, dispatch]);

  const show = !dismissed && (status === "denied" || status === "loading");

  return (
    <>
      {show && (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 11000,
            background: status === "loading" ? "#e0f2fe" : "#fef3c7",
            border: `1px solid ${status === "loading" ? "#7dd3fc" : "#fbbf24"}`,
            borderRadius: 12,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            maxWidth: 420,
          }}
        >
          <span style={{ fontSize: 20 }}>
            {status === "loading" ? "⏳" : "📍"}
          </span>
          <span style={{ flex: 1, fontSize: 14, lineHeight: 1.4 }}>
            {status === "loading"
              ? "Отримуємо ваше місцезнаходження..."
              : "Увімкніть геолокацію в браузері, щоб бачити свою позицію на мапі та прокладати маршрути."}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {status === "denied" && (
              <button
                onClick={() => dispatch(requestGeolocation())}
                style={{
                  padding: "6px 12px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: "pointer",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Увімкнути
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              style={{
                padding: "6px 10px",
                background: "transparent",
                border: "none",
                borderRadius: 6,
                fontSize: 16,
                cursor: "pointer",
                color: "#6b7280",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
