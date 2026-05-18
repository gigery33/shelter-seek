import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface Props {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
}

export default function Route({ from, to }: Props) {
  const map = useMap();

  useEffect(() => {
    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      router: (L.Routing as any).osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "foot",
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    } as any).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, from, to]);

  return null;
}
