import { api } from "./api";

export const sendDeviceCommand = async (
  deviceId: number,
  action: "on" | "off" | "open" | "close"
) => {
  const res = await api.post(`mqtt/devices/${deviceId}/command?action=${action}`);
  return res.data;
};
export const getDeviceState = async (deviceId: number) => {
  const res = await api.get(`/mqtt/devices/${deviceId}/state`);
  return res.data;
};

