import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { submitReport } from "../store/reports";

export default function SosModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const shelters = useAppSelector((s) => s.shelters.items);
  const { submitting } = useAppSelector((s) => s.reports);
  const [type, setType] = useState("CLOSED");
  const [shelterId, setShelterId] = useState("");
  const [comment, setComment] = useState("");
  const [toast, setToast] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: { type: string; comment?: string; shelterId?: string } = {
      type,
      comment: comment || undefined,
    };
    if (type === "CLOSED" && shelterId) {
      payload.shelterId = shelterId;
    }
    await dispatch(submitReport(payload));
    setToast(true);
    setComment("");
    setShelterId("");
    setTimeout(() => {
      setToast(false);
      onClose();
    }, 1500);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          width: 400,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {toast ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#16a34a" }}>
              Дякуємо, скаргу надіслано
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ margin: "0 0 16px", color: "#dc2626" }}>
              Повідомити про проблему
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <label>
                Тип
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    if (e.target.value !== "CLOSED") setShelterId("");
                  }}
                  style={inputStyle}
                >
                  <option value="CLOSED">Укриття зачинене</option>
                  <option value="EMERGENCY">Надзвичайна ситуація</option>
                  <option value="OTHER">Інше</option>
                </select>
              </label>

              {type === "CLOSED" && (
                <label>
                  Укриття
                  <select
                    value={shelterId}
                    onChange={(e) => setShelterId(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">-- Виберіть укриття --</option>
                    {shelters.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.address}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label>
                Коментар (необов'язково)
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Опишіть проблему..."
                  style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 8,
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
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
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "10px 20px",
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? "Надсилання..." : "Надіслати"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
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
