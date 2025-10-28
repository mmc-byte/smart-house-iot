import React from "react";
import { useAuthStore } from "../store/authStore";

const Dashboard: React.FC = () => {
  const { logout, activeRole , user} = useAuthStore();

  return (
    <div style={{ textAlign: "center", marginTop: "40vh" }}>
      <h1>Bienvenido/a</h1>
      <button onClick={logout}>Logout</button>
      <p>
        <strong>Rol: </strong> {activeRole ?? "null"}
      </p>
      <p>
        <strong>House: </strong> {user.houses_link[0].house_id}
      </p>
      {activeRole === null && (
        <p>No estás asignado a ningún hogar.</p>
      )}

      {activeRole === "guest" && (
        <p>Rol: guest (sin acceso a funciones restringidas)</p>
      )}

      {activeRole === "family" && (
        <button onClick={() => (window.location.href = "/control")}>Control del hogar</button>
      )}

      {activeRole === "owner" && (
        <>
          <button onClick={() => (window.location.href = "/manage")}>Gestionar</button>
          <button onClick={() => (window.location.href = "/control")}>Control del hogar</button>
        </>
        )
      }
      </div>
      );
    };

export default Dashboard;