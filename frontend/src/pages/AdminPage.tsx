import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth";
import {
  fetchShelters,
  createShelter,
  updateShelter,
  deleteShelter,
  type Shelter,
} from "../store/shelters";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const typeOptions = ["METRO", "BOMB_SHELTER", "UNDERGROUND_PARKING"] as const;
const amenityOptions = ["WATER", "INTERNET", "ACCESSIBLE"] as const;

type FormData = {
  name: string;
  type: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  amenities: string[];
  capacity: number;
  status: string;
};

const emptyForm: FormData = {
  name: "",
  type: "BOMB_SHELTER",
  description: "",
  address: "",
  lat: 50.4501,
  lng: 30.5234,
  amenities: [],
  capacity: 100,
  status: "OPEN",
};

function ClickPicker({
  onPick,
  lat,
  lng,
}: {
  onPick: (lat: number, lng: number) => void;
  lat: number;
  lng: number;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return <Marker position={[lat, lng]} />;
}

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { items: shelters, loading } = useAppSelector((s) => s.shelters);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchShelters());
  }, [dispatch]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(s: Shelter) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      type: s.type,
      description: s.description || "",
      address: s.address,
      lat: s.lat,
      lng: s.lng,
      amenities: [...s.amenities],
      capacity: s.capacity,
      status: s.status,
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...form };
      if (!payload.description) delete payload.description;

      if (editingId) {
        await dispatch(updateShelter({ id: editingId, data: payload })).unwrap();
      } else {
        await dispatch(createShelter(payload)).unwrap();
      }
      setShowModal(false);
      dispatch(fetchShelters());
    } catch (e: any) {
      alert(e.message || "Error saving shelter");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Видалити укриття "${name}"?`)) return;
    try {
      await dispatch(deleteShelter(id)).unwrap();
      dispatch(fetchShelters());
    } catch (e: any) {
      alert(e.message || "Error deleting shelter");
    }
  }

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  }

  const typeLabels: Record<string, string> = {
    METRO: "Метро",
    BOMB_SHELTER: "Укриття",
    UNDERGROUND_PARKING: "Паркінг",
  };

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>Панель адміністратора</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#64748b" }}>{user?.email}</span>
          <button
            onClick={() => dispatch(logout())}
            style={{
              padding: "8px 16px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Вийти
          </button>
        </div>
      </div>

      <button
        onClick={openCreate}
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        + Додати укриття
      </button>

      {loading && <p style={{ color: "#6b7280" }}>Завантаження...</p>}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
        }}
      >
        <thead>
          <tr style={{ background: "#f9fafb", textAlign: "left" }}>
            <th style={{ padding: "10px 12px", borderBottom: "2px solid #e5e7eb" }}>Назва</th>
            <th style={{ padding: "10px 12px", borderBottom: "2px solid #e5e7eb" }}>Тип</th>
            <th style={{ padding: "10px 12px", borderBottom: "2px solid #e5e7eb" }}>Адреса</th>
            <th style={{ padding: "10px 12px", borderBottom: "2px solid #e5e7eb" }}>Координати</th>
            <th style={{ padding: "10px 12px", borderBottom: "2px solid #e5e7eb" }}>Місткість</th>
            <th style={{ padding: "10px 12px", borderBottom: "2px solid #e5e7eb" }}>Статус</th>
            <th style={{ padding: "10px 12px", borderBottom: "2px solid #e5e7eb" }}>Дії</th>
          </tr>
        </thead>
        <tbody>
          {shelters.map((s) => (
            <tr key={s.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>{s.name}</td>
              <td style={{ padding: "10px 12px" }}>{typeLabels[s.type] || s.type}</td>
              <td style={{ padding: "10px 12px", color: "#6b7280" }}>{s.address}</td>
              <td style={{ padding: "10px 12px" }}>
                {s.lat.toFixed(4)}, {s.lng.toFixed(4)}
              </td>
              <td style={{ padding: "10px 12px" }}>{s.capacity}</td>
              <td style={{ padding: "10px 12px" }}>
                <span
                  style={{
                    color: s.status === "OPEN" ? "#16a34a" : "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  {s.status === "OPEN" ? "Відкрито" : "Закрито"}
                </span>
              </td>
              <td style={{ padding: "10px 12px" }}>
                <button
                  onClick={() => openEdit(s)}
                  style={{
                    padding: "4px 12px",
                    marginRight: 8,
                    background: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.name)}
                  style={{
                    padding: "4px 12px",
                    background: "#fef2f2",
                    border: "1px solid #fca5a5",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#dc2626",
                  }}
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              width: 520,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 16px" }}>
              {editingId ? "Редагувати укриття" : "Додати укриття"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label>
                Назва
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                />
              </label>

              <label>
                Тип
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={inputStyle}
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {typeLabels[t]}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Опис
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                />
              </label>

              <label>
                Адреса
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={inputStyle}
                />
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>
                  Lat
                  <input
                    type="number"
                    step="any"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: +e.target.value })}
                    style={inputStyle}
                  />
                </label>
                <label style={{ flex: 1 }}>
                  Lng
                  <input
                    type="number"
                    step="any"
                    value={form.lng}
                    onChange={(e) => setForm({ ...form, lng: +e.target.value })}
                    style={inputStyle}
                  />
                </label>
              </div>

              <div>
                <div style={{ marginBottom: 4 }}>Координати (клік на мапі)</div>
                <div style={{ height: 200, borderRadius: 8, overflow: "hidden" }}>
                  <MapContainer
                    center={[form.lat, form.lng]}
                    zoom={13}
                    style={{ width: "100%", height: "100%" }}
                    key={`${form.lat}-${form.lng}`}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClickPicker
                      onPick={(lat, lng) => setForm({ ...form, lat, lng })}
                      lat={form.lat}
                      lng={form.lng}
                    />
                  </MapContainer>
                </div>
              </div>

              <label>
                Місткість (осіб)
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: +e.target.value })}
                  style={inputStyle}
                />
              </label>

              <label>
                Статус
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={inputStyle}
                >
                  <option value="OPEN">Відкрито</option>
                  <option value="CLOSED">Закрито</option>
                </select>
              </label>

              <div>
                <div style={{ marginBottom: 6 }}>Зручності</div>
                <div style={{ display: "flex", gap: 16 }}>
                  {amenityOptions.map((a) => (
                    <label key={a} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={form.amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                      />
                      {a === "WATER" ? "Вода" : a === "INTERNET" ? "Інтернет" : "Доступність"}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px",
                  background: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Скасувати
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "10px 20px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 4,
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
};
