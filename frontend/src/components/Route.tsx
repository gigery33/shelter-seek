import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface Props {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
}

const styleId = "route-panel-style";

function injectStyle() {
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .leaflet-routing-container {
      background: rgba(255,255,255,0.92) !important;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.12);
      padding: 8px 12px;
      max-height: 300px;
      overflow-y: auto;
    }
    .leaflet-routing-alt {
      background: transparent !important;
      border: none !important;
    }
  `;
  document.head.appendChild(style);
}

export default function Route({ from, to }: Props) {
  const map = useMap();

  useEffect(() => {
    injectStyle();

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      router: (L.Routing as any).osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "foot",
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: true,
      routeDragInterval: 500,
    } as any).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, from, to]);

  return null;
}
