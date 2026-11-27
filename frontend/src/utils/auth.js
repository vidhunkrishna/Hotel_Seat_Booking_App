import { logoutapi } from "@/services/authservice.js";
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};
export const logout = async () => {
  await logoutapi();
  clearAuth();
};
