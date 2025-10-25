import React from "react";
import { useAuthStore } from "../store/authStore";

export const DebugAuth: React.FC = () => {
  const { user, token, isAuthenticated, initializing } = useAuthStore();

  return (
    <div
      style={{
        background: "#fafafa",
        borderBottom: "1px solid #ccc",
        fontSize: "13px",
        padding: "10px",
        fontFamily: "monospace",
      }}
    >
      <b>🧩 Auth Debug Panel</b>
      <div>Inicializando: {initializing ? "⏳ Sí" : "✅ No"}</div>
      <div>Autenticado: {isAuthenticated ? "✅ Sí" : "❌ No"}</div>
      <div>
        Usuario:{" "}
        {user
          ? `${user.username} (${user.email})`
          : "—"}
      </div>
      <div style={{ wordBreak: "break-all" }}>
        Token:{" "}
        {token ? (
          <>
            {token}
            <br />
            <small>(longitud: {token.length})</small>
          </>
        ) : (
          "—"
        )}
      </div>
    </div>
  );
};

