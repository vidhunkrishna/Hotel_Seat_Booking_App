import api from "./api.js";

export const gethotels = async () => {
  const response = await api.get("/hotels");
  return response.data;
};
export const gethotelsByid = async (id) => {
  const response = await api.get(`/hotels/${id}`);
  return response.data;
};
