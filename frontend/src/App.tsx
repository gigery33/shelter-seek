import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Map from "./components/Map";
import UserMarker from "./components/UserMarker";
import ShelterMarker from "./components/ShelterMarker";
import RouteLayer from "./components/Route";
import FilterPanel from "./components/FilterPanel";
import SosButton from "./components/SosButton";
import SosModal from "./components/SosModal";
import GeolocationGate from "./components/GeolocationGate";
import { AdminRoute } from "./components/AdminRoute";
import LoginPage from "./pages/LoginPage";

const AdminPage = lazy(() => import("./pages/AdminPage"));
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchCurrentUser } from "./store/auth";
import { fetchShelters, selectVisibleShelters, clearRoute } from "./store/shelters";
import MapBoundsAdjuster from "./components/MapBoundsAdjuster";
import OfflineBanner from "./components/OfflineBanner";

function MapPage() {
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "ok" | "error"
  >("checking");
  const [sosOpen, setSosOpen] = useState(false);
  const { position } = useAppSelector((s) => s.geolocation);
  const { routingTo, items: allShelters, nearestMode, nearest } = useAppSelector((s) => s.shelters);
  const visibleShelters = useAppSelector(selectVisibleShelters);
  const dispatch = useAppDispatch();

  const routeShelter = routingTo ? allShelters.find((s) => s.id === routingTo) : null;

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
          {nearestMode && <MapBoundsAdjuster />}
          {position && <UserMarker lat={position.lat} lng={position.lng} />}
          {(nearestMode ? nearest : visibleShelters).map((s) => (
            <ShelterMarker key={s.id} shelter={s} />
          ))}
          {routeShelter && position && (
            <RouteLayer
              from={position}
              to={{ lat: routeShelter.lat, lng: routeShelter.lng }}
            />
          )}
        </Map>
          {routingTo && (
          <button
            onClick={() => dispatch(clearRoute())}
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              padding: "10px 20px",
              background: "rgba(255,255,255,0.9)",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            ✕ Скасувати маршрут
          </button>
        )}
        <SosButton onClick={() => setSosOpen(true)} />
        <SosModal open={sosOpen} onClose={() => setSosOpen(false)} />
        <OfflineBanner />
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
          {backendStatus === "checking" && "⏳ Перевірка..."}
          {backendStatus === "ok" && "✅ Online"}
          {backendStatus === "error" && "❌ Offline"}
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
          <Suspense fallback={<div style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>Завантаження...</div>}>
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          </Suspense>
        }
      />
    </Routes>
  );
}
