import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Map from "./components/Map";
import UserMarker from "./components/UserMarker";
import ShelterMarker from "./components/ShelterMarker";
import FilterPanel from "./components/FilterPanel";
import GeolocationGate from "./components/GeolocationGate";
import { AdminRoute } from "./components/AdminRoute";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchCurrentUser } from "./store/auth";
import { fetchShelters, selectVisibleShelters } from "./store/shelters";

function MapPage() {
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "ok" | "error"
  >("checking");
  const { position } = useAppSelector((s) => s.geolocation);
  const visibleShelters = useAppSelector(selectVisibleShelters);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(data.status === "ok" ? "ok" : "error");
      })
      .catch(() => setBackendStatus("error"));
  }, []);

  useEffect(() => {
    dispatch(fetchShelters());
  }, [dispatch]);

  return (
    <GeolocationGate>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Map userPosition={position}>
          <FilterPanel />
          {position && <UserMarker lat={position.lat} lng={position.lng} />}
          {visibleShelters.map((s) => (
            <ShelterMarker key={s.id} shelter={s} />
          ))}
        </Map>
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1000,
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 14,
            background:
              backendStatus === "ok"
                ? "#d4edda"
                : backendStatus === "error"
                  ? "#f8d7da"
                  : "#fff3cd",
            color:
              backendStatus === "ok"
                ? "#155724"
                : backendStatus === "error"
                  ? "#721c24"
                  : "#856404",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {backendStatus === "checking" && "⏳ Connecting..."}
          {backendStatus === "ok" && "✅ Backend: OK"}
          {backendStatus === "error" && "❌ Backend: Disconnected"}
        </div>
      </div>
    </GeolocationGate>
  );
}

function AdminLoginPage() {
  const { user, loading } = useAppSelector((s) => s.auth);
  if (loading) return null;
  if (user?.isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return <LoginPage />;
}

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
