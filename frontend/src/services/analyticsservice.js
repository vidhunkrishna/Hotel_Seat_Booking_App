import api from "./api.js";
export const getAnalytics = async (id) => {
  const response = await api.get(`/hotels/${id}/analytics`);
  return response.data;
};
