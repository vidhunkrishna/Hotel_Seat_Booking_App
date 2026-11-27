import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090/api",
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "http://localhost:9090/api",
  withCredentials: true,
});

let refreshPromise = null;

export const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post("/auth/refresh")
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("token", token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.headers?.Authorization &&
      ![
        "/auth/login",
        "/auth/register",
        "/auth/refresh",
        "/auth/logout",
      ].includes(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const currentToken = localStorage.getItem("token");

        const token =
          currentToken &&
          originalRequest.headers.Authorization !== `Bearer ${currentToken}`
            ? currentToken
            : await refreshSession();

        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
        if (refreshError.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");

          sessionStorage.setItem(
            "sessionExpired",
            "Your session has expired. Please log in again.",
          );

          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
