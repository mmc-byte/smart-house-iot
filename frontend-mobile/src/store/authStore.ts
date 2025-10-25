import { create } from "zustand";
import { getCurrentUser } from "../services/authService";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  initializing: boolean;
  activeRole: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  rehydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  initializing: true,
  activeRole: null,

  rehydrate: async () => {
    // console.log("🟩 rehydrate: función llamada");
    const token = localStorage.getItem("token");

    if (!token) {
      // console.log("🟩 rehydrate: no hay token");
      console.log("No hay token.");
      set(() => ({
        token: null,
        user: null,
        isAuthenticated: false,
        activeRole: null,
        initializing: false,
      }));
      return;
    }

    try {
      // console.log("🟨 rehydrate: token encontrado, cargando perfil...");
      const profile = await getCurrentUser();

      const role = profile?.houses_link?.[0]?.role?.name || null;
      // console.log("🟩 rehydrate: perfil recibido ", profile);
      console.log("Perfil recibido.");

      set(() => ({
        token,
        user: profile,
        isAuthenticated: true,
        activeRole: role,
        initializing: false,
      }));
      // console.log("🟩 rehydrate: terminado");
    } catch (err) {
      console.error("🟥 rehydrate: Error al obtener perfil - ", err);

      localStorage.removeItem("token");
      set(() => ({
        token: null,
        user: null,
        isAuthenticated: false,
        activeRole: null,
        initializing: false,
      }));
    } finally {
      set((state) => ({ ...state, initializing: false }));
    }
  },

  login: async (credentials) => {
    const res = await (await import("../services/authService")).login(credentials);
    const profile = await getCurrentUser();
    const role = profile?.houses_link?.[0]?.role?.name || null;
    set({ token: res.access_token, user: profile, isAuthenticated: true, activeRole: role });
    localStorage.setItem("token", res.access_token);
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, isAuthenticated: false, activeRole: null });
  },
}));