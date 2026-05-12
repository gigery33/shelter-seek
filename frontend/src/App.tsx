import { useEffect, useState } from "react"
import Map from "./components/Map"
import UserMarker from "./components/UserMarker"
import GeolocationGate from "./components/GeolocationGate"
import { useAppSelector } from "./store/hooks"

function App() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "ok" | "error">("checking")
  const { position } = useAppSelector((s) => s.geolocation)

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(data.status === "ok" ? "ok" : "error")
      })
      .catch(() => setBackendStatus("error"))
  }, [])

  return (
    <GeolocationGate>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Map userPosition={position}>
          {position && <UserMarker lat={position.lat} lng={position.lng} />}
        </Map>
        <div style={{
          position: "absolute", top: 16, right: 16, zIndex: 1000,
          padding: "8px 16px", borderRadius: 8, fontSize: 14,
          background: backendStatus === "ok" ? "#d4edda" : backendStatus === "error" ? "#f8d7da" : "#fff3cd",
          color: backendStatus === "ok" ? "#155724" : backendStatus === "error" ? "#721c24" : "#856404",
          fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>
          {backendStatus === "checking" && "⏳ Connecting..."}
          {backendStatus === "ok" && "✅ Backend: OK"}
          {backendStatus === "error" && "❌ Backend: Disconnected"}
        </div>
      </div>
    </GeolocationGate>
  )
}

export default App
