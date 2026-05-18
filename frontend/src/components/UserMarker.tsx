import { useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const userIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 28px; height: 28px;
    background: #2563eb;
    border: 4px solid #93c5fd;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.25), 0 2px 12px rgba(37,99,235,0.6);
  "><div style="
    width: 10px; height: 10px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  "></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
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
