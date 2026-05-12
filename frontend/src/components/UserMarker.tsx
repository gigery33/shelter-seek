import { useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const userIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 24px; height: 24px;
    background: #2563eb;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(37,99,235,0.5);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface Props {
  lat: number;
  lng: number;
}

export default function UserMarker({ lat, lng }: Props) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);

  return (
    <Marker position={[lat, lng]} icon={userIcon}>
      <Popup>Ви тут</Popup>
    </Marker>
  );
}
