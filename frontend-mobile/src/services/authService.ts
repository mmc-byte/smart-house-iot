import { api } from "./api";

/*Solo envíen json al backend, ojo.*/

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  const res = await api.post("/users/login", credentials, {
    headers: { "Content-Type": "application/json" },
  });

  localStorage.setItem("token", res.data.access_token);  // Estado persistente !
  return res.data;
};


export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  // console.log('🔴Es en authService') //solo para debug
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const res = await api.post("/users/register", data);
  return res.data;
};
