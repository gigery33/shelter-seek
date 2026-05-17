import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  setTypeFilter,
  setAmenityFilter,
  resetFilters,
  selectVisibleShelters,
} from "../store/shelters";

const typeOptions = [
  { value: "METRO", label: "Метро" },
  { value: "BOMB_SHELTER", label: "Укриття" },
  { value: "UNDERGROUND_PARKING", label: "Паркінг" },
];

const amenityOptions = [
  { value: "WATER", label: "Вода" },
  { value: "INTERNET", label: "Інтернет" },
  { value: "ACCESSIBLE", label: "Доступність" },
];

export default function FilterPanel() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((s) => s.shelters);
  const visibleCount = useAppSelector(selectVisibleShelters).length;
  const totalCount = useAppSelector((s) => s.shelters.items.length);

  const hasActiveFilters =
    filters.types.length > 0 || filters.amenities.length > 0;

  function toggleType(value: string) {
    const next = filters.types.includes(value)
      ? filters.types.filter((t) => t !== value)
      : [...filters.types, value];
    dispatch(setTypeFilter(next));
  }

  function toggleAmenity(value: string) {
    const next = filters.amenities.includes(value)
      ? filters.amenities.filter((a) => a !== value)
      : [...filters.amenities, value];
    dispatch(setAmenityFilter(next));
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 1000,
        background: "#fff",
        borderRadius: 10,
        padding: "12px 16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        fontSize: 13,
        minWidth: 170,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
        Фільтри
        <span style={{ color: "#6b7280", fontWeight: 400, marginLeft: 6 }}>
          ({visibleCount}/{totalCount})
        </span>
      </div>

      <div style={{ marginBottom: 6, color: "#374151" }}>Тип</div>
      {typeOptions.map((o) => (
        <label
          key={o.value}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={filters.types.includes(o.value)}
            onChange={() => toggleType(o.value)}
          />
          {o.label}
        </label>
      ))}

      <div style={{ marginTop: 10, marginBottom: 6, color: "#374151" }}>
        Зручності
      </div>
      {amenityOptions.map((o) => (
        <label
          key={o.value}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={filters.amenities.includes(o.value)}
            onChange={() => toggleAmenity(o.value)}
          />
          {o.label}
        </label>
      ))}

      {hasActiveFilters && (
        <button
          onClick={() => dispatch(resetFilters())}
          style={{
            marginTop: 10,
            width: "100%",
            padding: "6px 0",
            background: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Скинути фільтри
        </button>
      )}
    </div>
  );
}
