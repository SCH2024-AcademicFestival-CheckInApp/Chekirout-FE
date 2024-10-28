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
import { useEffect } from "react";
import { setupAxiosInterceptors } from "@/lib/axiosInterceptor";
import { LoginFormSchema, LoginFormData } from "@/schemas/loginSchema";
import { useLogin } from "@/hooks/useLogin";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import ErrorModal from "@/components/ErrorModal";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { handleLogin: handleLoginApi, isLoading } = useLogin();
  const { errorConfig, handleError, clearError } = useErrorHandler();

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

  const handleLoginSubmit = async (data: LoginFormData) => {
    try {
      await handleLoginApi(data);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <main className="w-[480px] h-screen flex flex-col items-center bg-white">
      <div className="text-center pt-[200px] mb-20">
        <div className="text-5xl font-black text-[#235698]">로그인</div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLoginSubmit)}
          className="w-[328px] space-y-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-[328px]">
                <FormLabel>학번</FormLabel>
                <FormControl>
                  <Input
                    placeholder="학번을 입력하세요"
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
            disabled={isLoading}
            className="w-[328px] h-11 bg-[#235698] text-white font-semibold rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </Form>
      <div className="mt-6 text-sm text-gray-600">
        아직 계정이 없으신가요?{" "}
        <Link href="/signin" className="text-[#235698] font-semibold hover:underline">
          회원가입
        </Link>
      </div>

      {errorConfig && (
        <ErrorModal
          message={errorConfig.message}
          actions={errorConfig.actions}
          isLoading={isLoading}
        />
      )}
    </main>
  );
}