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
    console.log("🟥🟥rehydrate: función llamada");
    console.log("rehydrate: iniciando...");
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("rehydrate: no hay token");
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
      console.log("rehydrate: token encontrado, cargando perfil...");
      const profile = await getCurrentUser();

      const role = profile?.houses_link?.[0]?.role?.name || null;
      console.log("perfil recibido:", profile);

      set(() => ({
        token,
        user: profile,
        isAuthenticated: true,
        activeRole: role,
        initializing: false,
      }));
      console.log("rehydrate: terminado");
    } catch (err) {
      console.error("Error al obtener perfil:", err);

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

// interface AuthState {
//   user: any | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   initializing: boolean; // ya sabe si hay sesión activa?
//   login: (credentials: any) => Promise<void>;
//   logout: () => void;
//   rehydrate: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   initializing: true,

//   // Auto-rehidratación: lee localStorage y valida token
//   rehydrate: async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       set({ initializing: false });
//       return;
//     }
//     try {
//       const profile = await getCurrentUser();
//       set({ token, user: profile, isAuthenticated: true, initializing: false });
//       console.log("Sesión restaurada automáticamente:", profile.username);
//     } catch (err) {
//       console.warn("Token inválido o expirado");
//       localStorage.removeItem("token");
//       set({ token: null, user: null, isAuthenticated: false, initializing: false });
//     }
//   },

//   login: async (credentials) => {
//     const res = await (await import("../services/authService")).login(credentials);
//     const profile = await getCurrentUser();
//     set({ token: res.access_token, user: profile, isAuthenticated: true });
//     localStorage.setItem("token", res.access_token);
//   },

//   logout: () => {
//     localStorage.removeItem("token");
//     set({ token: null, user: null, isAuthenticated: false });
//   },
// }));
