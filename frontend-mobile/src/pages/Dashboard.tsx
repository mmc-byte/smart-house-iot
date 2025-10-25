import React from "react";
import { useAuthStore } from "../store/authStore";

const Dashboard: React.FC = () => {
  const { logout, activeRole } = useAuthStore();

  return (
    <div style={{ textAlign: "center", marginTop: "40vh" }}>
      <h1>Dashboard</h1>
      <p>You are logged in!</p>
      <button onClick={logout}>Logout</button>
      <p>
        <strong>Active role:</strong> {activeRole ?? "null"}
      </p>

      {activeRole === null && (
        <p>No estás asignado a ningún hogar.</p>
      )}

      {activeRole === "guest" && (
        <p>Rol: guest (sin acceso a funciones restringidas)</p>
      )}

      {activeRole === "family" && (
        <button onClick={() => (window.location.href = "/control")}>Go to Control</button>
      )}

      {activeRole === "owner" && (
        <>
          <button onClick={() => (window.location.href = "/manage")}>Go to Manage</button>
          <button onClick={() => (window.location.href = "/control")}>Go to Control</button>
        </>
        )
      }
      </div>
      );
    };

// export default Dashboard;

// import React from "react";
// import { useAuthStore } from "../store/authStore";

// const Dashboard: React.FC = () => {
//   const { logout, activeRole } = useAuthStore();

//   return (
//     <div style={{ textAlign: "center", marginTop: "40vh" }}>
//       <h1>Dashboard</h1>
//       <p>You are logged in!</p>
//       <button onClick={logout}>Logout</button>
//       <p>
//         <strong>Active role:</strong> {activeRole ?? "null"}
//       </p>
//       <button onClick={() => (window.location.href = "/manage")}>Go to Manage</button>
//       <button onClick={() => (window.location.href = "/control")}>Go to Control</button>
//     </div>

//   );
// };

export default Dashboard;