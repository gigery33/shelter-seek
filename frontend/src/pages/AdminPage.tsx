import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth";

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  return (
    <div style={{ padding: 32 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
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
      <p style={{ color: "#64748b" }}>
        Тут буде редагування укриттів
      </p>
    </div>
  );
}
