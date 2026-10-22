import api from "./api.js";

export const gethotels = async () => {
  const response = await api.get("/api/hotels");
  return response.data;
};
