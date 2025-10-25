import { create } from "zustand";
import { getCurrentUser } from "../services/authService";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  initializing: boolean; // ya sabe si hay sesión activa?
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  rehydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  initializing: true,

  // Auto-rehidratación: lee localStorage y valida token
  rehydrate: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ initializing: false });
      return;
    }
    try {
      const profile = await getCurrentUser();
      set({ token, user: profile, isAuthenticated: true, initializing: false });
      console.log("Sesión restaurada automáticamente:", profile.username);
    } catch (err) {
      console.warn("Token inválido o expirado");
      localStorage.removeItem("token");
      set({ token: null, user: null, isAuthenticated: false, initializing: false });
    }
  },

  login: async (credentials) => {
    const res = await (await import("../services/authService")).login(credentials);
    const profile = await getCurrentUser();
    set({ token: res.access_token, user: profile, isAuthenticated: true });
    localStorage.setItem("token", res.access_token);
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { login, getCurrentUser } from "../services/authService";

// interface AuthState {
//   user: any;
//   token: string | null;
//   initializing: boolean; 
//   loading: boolean;
//   loginUser: (credentials: any) => Promise<void>;
//   logoutUser: () => void;
//   rehydrate: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       // loading: false,
//       initializing: true,

//       loginUser: async (credentials) => {
//         set({ loading: true });
//         try {
//           const data = await login(credentials);
//           set({
//             token: data.access_token,
//             isAuthenticated: true,
//           });
//           // Obtener perfil
//           const profile = await getCurrentUser();
//           set({ user: profile });
//           console.log("✅ Usuario logueado y perfil cargado:", profile);
//         } catch (err) {
//           console.error("❌ Error en login:", err);
//           set({ isAuthenticated: false, token: null, user: null });
//           throw err;
//         } finally {
//           set({ loading: false });
//         }
//       },

      
//       logoutUser: () => {
//         console.log("Cerrando sesión");
//         localStorage.removeItem("token");
//         set({ user: null, token: null, isAuthenticated: false });
//       },

//       //  Verificar token persistido
//       checkAuth: async () => {
//         const { token } = get();
//         if (!token) return;
//         try {
//           console.log("🔍 Verificando token persistido...");
//           const profile = await getCurrentUser();
//           set({ user: profile, isAuthenticated: true });
//           console.log("Sesión restaurada:", profile);
//         } catch (err) {
//           console.warn("Token inválido o expirado");
//           get().logoutUser();
//         }
//       },
//     }),
//     {
//       name: "auth-storage", // nombre en localStorage
//       partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
//     }
//   )
// );
