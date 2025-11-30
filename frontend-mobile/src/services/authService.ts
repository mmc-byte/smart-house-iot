import { api } from "./api";

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  const res = await api.post("/users/login", credentials, {
    headers: { "Content-Type": "application/json" },
  });
  console.log(credentials);
  localStorage.setItem("token", res.data.access_token);  // Estado persistente !
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const getNoRoleUsers = async () => {
  const res = await api.get("/users/no-role");
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

