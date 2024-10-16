"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField, PasswordField, SelectField } from "@/components/FormField";
import { departments } from "@/constants/constants";
import { SigninSchema, SigninFormData } from "@/schemas/signinSchema";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<SigninFormData>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      username: "",
      department: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const validateUsername = useCallback(async (username: string) => {
    if (!username) {
      setUsernameError(null);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/validate-username`,
        {
          params: { username },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setUsernameError(null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setUsernameError("이미 사용 중인 학번입니다.");
      } else {
        console.error("학번 유효성 검사 오류:", error);
        setUsernameError("학번 확인 중 오류가 발생했습니다.");
      }
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      validateUsername(debouncedUsername);
    }, 1000);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [debouncedUsername, validateUsername]);

  async function onSubmit(data: SigninFormData) {
    setIsLoading(true);
    try {
      const selectedDepartment = departments.find(
        (dept) => dept.value === data.department
      );
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/signup`,
        {
          username: data.username,
          department: selectedDepartment ? selectedDepartment.value : "",
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );

      if (response.status === 200) {
        console.log("이메일 인증으로 넘어갑니다.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      console.log("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="w-[480px] h-screen flex flex-col items-center bg-white overflow-y-auto">
      <div className="text-center pt-[100px] mb-10">
        <div className="text-5xl font-black text-[#235698]">회원가입</div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[328px] space-y-6 mb-10">
          <TextField
            control={form.control}
            name="username"
            label="학번"
            placeholder="학번을 입력하세요"
            onChange={(e) => {
              form.setValue("username", e.target.value);
              setDebouncedUsername(e.target.value);
            }}
            error={usernameError}
          />
          {usernameError && (
            <p className="text-red-500 text-sm mt-1">{usernameError}</p>
          )}
          <SelectField
            control={form.control}
            name="department"
            label="학과"
            options={departments}
            placeholder="학과를 선택하세요"
          />
          <TextField
            control={form.control}
            name="name"
            label="이름"
            placeholder="이름을 입력하세요"
          />
          <TextField
            control={form.control}
            name="email"
            label="이메일"
            placeholder="이메일"
          />
          <PasswordField
            control={form.control}
            name="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
          />
          <PasswordField
            control={form.control}
            name="confirmPassword"
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
          />

          <Button
            type="submit"
            className="w-[328px] h-11 bg-[#235698] text-white font-semibold rounded-lg"
            disabled={isLoading || !!usernameError}>
            {isLoading ? "처리 중..." : "회원가입"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
