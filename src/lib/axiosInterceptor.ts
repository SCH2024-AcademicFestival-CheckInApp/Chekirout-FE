import axios from "axios";
import { refreshToken } from "@/api/auth";

export const setupAxiosInterceptors = (router: any) => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const storedRefreshToken = localStorage.getItem("refreshToken");
          const refreshResponse = await refreshToken(storedRefreshToken!);
          const newAccessToken = refreshResponse.data.accessToken;
          
          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } else {
            throw new Error("New access token not received");
          }
        } catch (refreshError) {
          console.error("토큰 갱신 실패:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          router.push("/login");
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};