import api from "./api.js";

export const generateQR = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}/qr`);
  return response.data;
};

export const verifyQR = async (token) => {
  const response = await api.post("/qr/verify", { token });
  return response.data;
};
