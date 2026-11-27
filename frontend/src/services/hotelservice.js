import api from "./api.js";

export const gethotels = async () => {
  const response = await api.get("/hotels");
  return response.data;
};
export const gethotelsByid = async (id) => {
  const response = await api.get(`/hotels/${id}`);
  return response.data;
};
export const gettables = async (id) => {
  const response = await api.get(`/hotels/${id}/tables`);
  return response.data;
};
export const managedHotels = async () => {
  const response = await api.get("/hotels/managed");
  return response.data;
};
export const addHotel = async (hotelData) => {
  const response = await api.post("/hotels", hotelData);
  return response.data;
};
export const updateHotel = async (id, hotelData) => {
  const response = await api.patch(`/hotels/${id}`, hotelData);
  return response.data;
};
export const deleteHotel = async (id) => {
  const response = await api.delete(`/hotels/${id}`);
  return response.data;
};
