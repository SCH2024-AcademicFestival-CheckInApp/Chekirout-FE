"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField, PasswordField, SelectField } from "@/components/FormField";

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
    userType: z.enum(["일반", "관리자"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

const departments = [
  "컴퓨터소프트웨어공학과",
  "의료 IT공학과",
  "정보보호학과",
  "사물인터넷학과",
  "메타버스게임학과",
];

export default function SignupPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      studentId: "",
      department: "",
      name: "",
      password: "",
      confirmPassword: "",
      userType: "일반",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("회원가입 시도", data);
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
                  form.watch("userType") === "일반" ? "default" : "outline"
                }
                onClick={() => form.setValue("userType", "일반")}
                className="flex-1 bg-gray-200 text-black hover:bg-gray-300">
                일반
              </Button>
              <Button
                type="button"
                variant={
                  form.watch("userType") === "관리자" ? "default" : "outline"
                }
                onClick={() => form.setValue("userType", "관리자")}
                className="flex-1 bg-gray-200 text-black hover:bg-gray-300">
                관리자
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-[328px] h-11 bg-[#235698] text-white font-semibold rounded-lg">
            회원가입
          </Button>
        </form>
      </Form>
    </main>
  );
}
