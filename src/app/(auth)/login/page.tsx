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
    <main className="w-[480px] min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center pt-[120px] mb-16 animate-fade-in">
        <div className="text-sm font-semibold text-[#235698]/80 tracking-tight mb-3">
          2024 SCH SW•AI Festival
        </div>
        <div className="text-5xl font-black text-[#235698]  leading-none mb-3">
          LOGIN
        </div>
        <div className="text-xs font-medium text-gray-500/90 tracking-tight">
          제 1회 SW융합대학 학술제 통합관리시스템
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLoginSubmit)}
          className="w-[328px] space-y-6 animate-slide-up"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-[328px]">
                <FormLabel className="text-sm font-medium text-gray-700">학번</FormLabel>
                <FormControl>
                  <Input
                    placeholder="학번을 입력하세요"
                    {...field}
                    className="w-full h-14 rounded-2xl bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm 
                    focus:border-[#235698] focus:ring-[#235698]/20 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage className="text-sm mt-1.5" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-[328px]">
                <FormLabel className="text-sm font-medium text-gray-700">비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    {...field}
                    className="w-full h-14 rounded-2xl bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm 
                    focus:border-[#235698] focus:ring-[#235698]/20 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage className="text-sm mt-1.5" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-[328px] h-14 bg-[#235698] text-white font-semibold rounded-2xl 
            disabled:bg-gray-300 disabled:cursor-not-allowed mt-6
            hover:bg-[#1a4276] active:scale-[0.98] transform transition-all duration-200
            shadow-lg shadow-[#235698]/20"
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