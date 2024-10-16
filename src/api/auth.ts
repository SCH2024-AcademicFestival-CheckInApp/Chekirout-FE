import axios from "axios";

export const login = async (username: string, password: string) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, {
    username,
    password,
  });
};

export const refreshToken = async (refreshToken: string) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/refresh-token`, {
    refreshToken,
  });
};