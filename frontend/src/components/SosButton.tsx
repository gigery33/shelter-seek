export default function SosButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#dc2626",
        color: "#fff",
        border: "none",
        fontSize: 18,
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(220,38,38,0.4)",
        zIndex: 9999,
      }}
    >
      SOS
    </button>
  );
}
