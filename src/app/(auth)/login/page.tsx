"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const FormSchema = z.object({
  username: z.string().min(8, {
    message: "학번 8자리를 입력해주세요.",
  }),
  password: z.string().min(6, {
    message: "비밀번호는 최소 8자 이상이어야 합니다.",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`,
        {
          username: data.username,
          password: data.password,
        }
      );

      if (response.status === 200) {
        console.log("로그인 성공");
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // 인터셉터 설정
        axios.interceptors.response.use(
          (response) => response,
          async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
              originalRequest._retry = true;
              try {
                const refreshToken = localStorage.getItem("refreshToken");
                const refreshResponse = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/refresh-token`,
                  { refreshToken: refreshToken }
                );
                
                
                const newAccessToken = refreshResponse.data.accessToken;    // 응답에서 새 액세스 토큰 추출 
                
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

        router.push("/home");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      console.log("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <main className="w-[480px] h-screen flex flex-col items-center bg-white">
      <div className="text-center pt-[200px] mb-20">
        <div className="text-5xl font-black text-[#235698]">로그인</div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[328px] space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-[328px]">
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input
                    placeholder="아이디를 입력하세요"
                    {...field}
                    className="w-full box-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-[328px]">
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    {...field}
                    className="w-full box-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-[328px] h-11 bg-[#235698] text-white font-semibold rounded-lg">
            로그인
          </Button>
        </form>
      </Form>
    </main>
  );
}
