import { useEffect, useState } from "react"
import Map from "./components/Map"

function App() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "ok" | "error">("checking")

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(data.status === "ok" ? "ok" : "error")
      })
      .catch(() => setBackendStatus("error"))
  }, [])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Map />
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
  )
}

export default App
