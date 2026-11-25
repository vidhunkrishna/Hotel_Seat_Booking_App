import api from "./api.js";
export const addReview = async (id, reviewdata) => {
  const response = await api.post(`/hotels/${id}/reviews`, reviewdata);
  return response.data;
};
export const getReviews = async (id) => {
  const response = await api.get(`/hotels/${id}/reviews`);
  return response.data;
};
export const editReview = async (id, editdata) => {
  const response = await api.patch(`/reviews/${id}`, editdata);
  return response.data;
};
export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};
