import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  allowedRoles?: string[]; // ← roles permitidos
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  allowedRoles,
  ...rest
}) => {
  const { isAuthenticated, activeRole } = useAuthStore();

  return (
    <Route
      {...rest}
      render={(props) => {
        //  Si no hay token → fuera
        if (!isAuthenticated) {
          return <Redirect to="/" />;
        }

        // Si hay token pero sin rol → bloqueado
        if (!activeRole) {
          return <Redirect to="/dashboard" />;
        }

        // Si tiene rol permitido → pasa
        if (!allowedRoles || allowedRoles.includes(activeRole)) {
          return <Component {...props} />;
        }

        // Si tiene rol pero no permitido
        return <Redirect to="/dashboard" />;
      }}
    />
  );
};

export default ProtectedRoute;

