"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { TextField, PasswordField, SelectField } from "@/components/FormField";
import { Device } from "@/components/Device";
import { departments } from "@/constants/constants";
import {
  EditProfileSchema,
  EditProfileFormData,
} from "@/schemas/editProfileSchema";

export default function EditMyPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      username: "20204023",
      department: departments[0].value,
      name: "황다경",
      email: "",
      phoneNumber: "",
      password: "",
      newPassword: "",
      confirmPassword: "",
      devices: [""],
    },
  });

  function onSubmit(values: EditProfileFormData) {
    console.log(values);
    toast({
      title: "정보가 수정되었습니다.",
      description: "변경사항이 성공적으로 저장되었습니다.",
    });
    router.push("/user/mypage");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-4 flex flex-col items-center mt-14 mb-14">
        <h1 className="text-2xl font-bold mb-4">내 정보 수정</h1>

        <div className="w-[328px] space-y-4">
          <TextField
            control={form.control}
            name="username"
            label="학번"
            disabled
          />
          <SelectField
            control={form.control}
            name="department"
            label="학과"
            options={departments}
            placeholder="학과를 선택하세요"
            disabled
          />
          <TextField control={form.control} name="name" label="이름" disabled />
          <TextField
            control={form.control}
            name="email"
            label="이메일"
            placeholder="이메일"
          />
          <TextField
            control={form.control}
            name="phoneNumber"
            label="전화번호"
            placeholder="전화번호"
          />
          <PasswordField
            control={form.control}
            name="password"
            label="현재 비밀번호"
            placeholder="현재 비밀번호"
          />
          <PasswordField
            control={form.control}
            name="newPassword"
            label="새 비밀번호"
            placeholder="새 비밀번호"
          />
          <PasswordField
            control={form.control}
            name="confirmPassword"
            label="새 비밀번호 확인"
            placeholder="새 비밀번호 확인"
          />

          <Device control={form.control} />

          <Button type="submit" className="w-full">
            저장하기
          </Button>
        </div>
      </form>
    </Form>
  );
}
