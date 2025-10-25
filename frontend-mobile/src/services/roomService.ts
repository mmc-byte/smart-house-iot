import { api } from "./api";

export const getRoomsByHouse = async (houseId: number) => {
  const res = await api.get(`/rooms/house/${houseId}`);
  return res.data;
};
