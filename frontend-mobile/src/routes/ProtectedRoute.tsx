import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  allowedRoles?: string[];
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
        //  No autenticado → inicio
        if (!isAuthenticated) return <Redirect to="/" />;

        // Sin rol activo → dashboard
        if (!activeRole) return <Redirect to="/dashboard" />;

        //  Rol permitido → renderizar componente
        if (!allowedRoles || allowedRoles.includes(activeRole)) {
          return <Component {...props} />;
        }

        //  Rol no permitido → dashboard
        return <Redirect to="/dashboard" />;
      }}
    />
  );
};

export default ProtectedRoute;
