import api from "./api.js";
export const createPayment = async (bookingId) => {
  const response = await api.post("/payments/create", { bookingId });
  return response.data;
};
export const verifyPayment = async (paymentDetails) => {
  const response = await api.post("/payments/verify", paymentDetails);
  return response.data;
};
