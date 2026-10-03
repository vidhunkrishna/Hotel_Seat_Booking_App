import api from "./api.js";
export const loginapi = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};
export const registerapi = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};
