import axios from "axios";
import { refreshToken } from "@/api/auth";

export const setupAxiosInterceptors = (router: any) => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // 401 Unauthorized 에러 처리
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const storedRefreshToken = localStorage.getItem("refreshToken");
          if (!storedRefreshToken) {
            throw new Error("Refresh token not found");
          }
          
          const refreshResponse = await refreshToken(storedRefreshToken);
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
      
      // 403 Forbidden 에러 처리 (권한 없음)
      if (error.response.status === 403) {
        console.error("접근 권한이 없습니다.");
        router.push("/login");
        return Promise.reject(error);
      }
      
      return Promise.reject(error);
    }
  );
};