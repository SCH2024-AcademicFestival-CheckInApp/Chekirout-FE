"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField, PasswordField, SelectField } from "@/components/FormField";
import { departments } from "@/constants/constants";

const FormSchema = z
  .object({
    studentId: z.string().length(8, {
      message: "학번 8자리를 입력해주세요.",
    }),
    department: z.string().min(1, "학과를 선택해주세요"),
    name: z.string().min(1, "이름을 입력해주세요"),
    password: z.string().min(6, {
      message: "비밀번호는 최소 6자 이상이어야 합니다.",
    }),
    confirmPassword: z.string(),
    userType: z.enum(["STUDENT", "ADMIN"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      studentId: "",
      department: "",
      name: "",
      password: "",
      confirmPassword: "",
      userType: "STUDENT",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const selectedDepartment = departments.find(
        (dept) => dept.value === data.department
      );
      const response = await axios.post(
        "http://ec2-15-165-241-189.ap-northeast-2.compute.amazonaws.com:8080/api/v1/signup",
        {
          username: data.studentId,
          department: selectedDepartment ? selectedDepartment.value : "",
          name: data.name,
          password: data.password,
          role: data.userType,
        }
      );

      if (response.status === 200) {
        console.log("회원가입이 완료되었습니다.");
        router.push("/login");
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
            name="studentId"
            label="학번"
            placeholder="학번을 입력하세요"
          />
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
          <div className="w-[328px]">
            <div className="text-sm mb-2">사용자 유형</div>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={
                  form.watch("userType") === "STUDENT" ? "default" : "outline"
                }
                onClick={() => form.setValue("userType", "STUDENT")}
                className="flex-1 bg-gray-200 text-black hover:bg-gray-300">
                일반
              </Button>
              <Button
                type="button"
                variant={
                  form.watch("userType") === "ADMIN" ? "default" : "outline"
                }
                onClick={() => form.setValue("userType", "ADMIN")}
                className="flex-1 bg-gray-200 text-black hover:bg-gray-300">
                관리자
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-[328px] h-11 bg-[#235698] text-white font-semibold rounded-lg"
            disabled={isLoading}>
            {isLoading ? "처리 중..." : "회원가입"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
