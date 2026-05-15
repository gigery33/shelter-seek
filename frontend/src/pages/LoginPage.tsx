import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login } from "../store/auth";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { user, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("admin");

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1f5f9",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "40px 48px",
          borderRadius: 16,
          width: 360,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ margin: "0 0 8px", color: "#1e293b" }}>Admin</h1>
        <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: 14 }}>
          Увійдіть для керування укриттями
        </p>

        {error && (
          <p
            style={{
              color: "#dc2626",
              fontSize: 13,
              marginBottom: 16,
              padding: "8px 12px",
              background: "#fef2f2",
              borderRadius: 8,
              wordBreak: "break-word",
            }}
          >
            {error}
          </p>
        )}

        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%", padding: "10px 12px", marginBottom: 16,
            border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14,
            boxSizing: "border-box",
          }}
        />

        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%", padding: "10px 12px", marginBottom: 24,
            border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14,
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%", padding: "12px", fontSize: 16, fontWeight: 600,
            color: "#fff", background: "#2563eb", border: "none",
            borderRadius: 10, cursor: "pointer",
          }}
        >
          Увійти
        </button>
      </form>
    </div>
  );
}
