import { useEffect, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { requestGeolocation } from "../store/geolocation";

interface Props {
  children: ReactNode;
}

export default function GeolocationGate({ children }: Props) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s) => s.geolocation);

  useEffect(() => {
    if (status === "idle") {
      dispatch(requestGeolocation());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          zIndex: 9999,
        }}
      >
        <p style={{ fontSize: 18, color: "#555" }}>
          Отримуємо ваше місцезнаходження...
        </p>
      </div>
    );
  }

  if (status !== "denied") return <>{children}</>;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "32px 40px",
          maxWidth: 400,
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
        <h2 style={{ margin: "0 0 12px", color: "#1a1a1a" }}>
          Геолокація відключена
        </h2>
        <p style={{ margin: 0, color: "#555", lineHeight: 1.5 }}>
          Ви не зможете знайти найближчі до вас укриття та
          отримувати маршрути до них.
        </p>
        <button
          onClick={() => dispatch(requestGeolocation())}
          style={{
            marginTop: 24,
            padding: "12px 32px",
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
            background: "#2563eb",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Надати доступ
        </button>
      </div>
    </div>
  );
}
