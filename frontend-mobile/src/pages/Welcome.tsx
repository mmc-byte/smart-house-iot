import React from "react";

const Welcome: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "40vh" }}>
      <h1>Welcome Page</h1>
      <p>Please log in to continue.</p>
      <button onClick={() => (window.location.href = "/login")}>Go to Login</button>
      <button onClick={() => (window.location.href = "/register")}>Go to Register</button>
    </div>
  );
};

export default Welcome;
