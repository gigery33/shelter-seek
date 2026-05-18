import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { startRoute } from "../store/shelters";
import type { Shelter } from "../store/shelters";

const colors: Record<string, string> = {
  METRO: "#6366f1",
  BOMB_SHELTER: "#ef4444",
  UNDERGROUND_PARKING: "#f59e0b",
};

const statusColors: Record<string, string> = {
  OPEN: "#22c55e",
  CLOSED: "#6b7280",
};

function makeIcon(type: string): L.DivIcon {
  const color = colors[type] || "#6366f1";
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 20px; height: 20px;
      background: ${color};
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

const typeLabels: Record<string, string> = {
  METRO: "Метро",
  BOMB_SHELTER: "Укриття",
  UNDERGROUND_PARKING: "Паркінг",
};

interface Props {
  shelter: Shelter;
}

export default function ShelterMarker({ shelter }: Props) {
  const dispatch = useAppDispatch();
  const position = useAppSelector((s) => s.geolocation.position);
  const noLocation = !position;

  return (
    <Marker position={[shelter.lat, shelter.lng]} icon={makeIcon(shelter.type)}>
      <Popup>
        <div style={{ minWidth: 180, fontSize: 14 }}>
          <strong style={{ fontSize: 16 }}>{shelter.name}</strong>
          <br />
          <span style={{ color: "#6b7280" }}>{shelter.address}</span>
          <br /><br />
          <span>Тип: {typeLabels[shelter.type] || shelter.type}</span>
          <br />
          <span>Місткість: {shelter.capacity} осіб</span>
          <br />
          <span style={{ color: statusColors[shelter.status] }}>
            {shelter.status === "OPEN" ? "Відкрито" : "Закрито"}
          </span>
          {shelter.amenities.length > 0 && (
            <>
              <br />
              <span>Зручності: {shelter.amenities.join(", ")}</span>
            </>
          )}
          {shelter.photoUrl && (
            <>
              <br />
              <img
                src={shelter.photoUrl}
                alt={shelter.name}
                style={{
                  width: "100%",
                  maxHeight: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  marginTop: 8,
                }}
              />
            </>
          )}
          <br /><br />
          {noLocation ? (
            <span style={{ color: "#9ca3af", fontSize: 12 }}>
              Для маршруту потрібна геолокація
            </span>
          ) : (
            <button
              onClick={() => dispatch(startRoute(shelter.id))}
              style={{
                padding: "6px 14px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Прокласти маршрут
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
