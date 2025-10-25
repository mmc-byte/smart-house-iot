import { api } from "./api";

export const getDevicesByRoom = async (roomId: number) => {
  const res = await api.get(`/devices/room/${roomId}`);
  return res.data;
};

export const createDevice = async (payload: { room_id: number; name: string; type: string }) => {
  const res = await api.post("/devices", payload);
  return res.data;
};
