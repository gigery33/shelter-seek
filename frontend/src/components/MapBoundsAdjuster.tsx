import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useAppSelector } from "../store/hooks";

export default function MapBoundsAdjuster() {
  const map = useMap();
  const { nearest } = useAppSelector((s) => s.shelters);
  const position = useAppSelector((s) => s.geolocation.position);

  useEffect(() => {
    const points: [number, number][] = nearest.map((s) => [s.lat, s.lng]);
    if (position) points.push([position.lat, position.lng]);
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [nearest, position, map]);

  return null;
}
