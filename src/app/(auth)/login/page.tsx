"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useEffect, useState } from "react";
import { setupAxiosInterceptors } from "@/lib/axiosInterceptor";
import { LoginFormSchema, LoginFormData } from "@/schemas/loginSchema";
import { login } from "@/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    setupAxiosInterceptors(router);
  }, [router]);

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const response = await login(data.username, data.password);
      if (response.status === 200) {
        console.log("로그인 성공");
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
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
