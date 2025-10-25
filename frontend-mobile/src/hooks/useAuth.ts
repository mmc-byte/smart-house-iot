import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    rehydrate,
    initializing,
  } = useAuthStore();

  // Restaurar sesión automáticamente al montar el hook
  // useEffect(() => {
  //   rehydrate();
  // }, [rehydrate]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    initializing,
  };
};
