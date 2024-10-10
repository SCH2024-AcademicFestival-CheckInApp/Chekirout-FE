"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { TextField, PasswordField } from "@/components/FormField";
import { Device } from "@/components/Device";
import { departments } from "@/constants/constants";
import {
  EditProfileSchema,
  EditProfileFormData,
} from "@/schemas/editProfileSchema";
import { useUserInfo } from "@/hooks/useUserInfo";

export default function EditMyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { userInfo, isLoading } = useUserInfo();

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      username: userInfo?.username || "",
      department: userInfo?.department || "",
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      phoneNumber: userInfo?.phoneNumber || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      devices: [""],
    },
  });

  useEffect(() => {
    if (userInfo) {
      const departmentName =
        departments.find((dept) => dept.value === userInfo.department)?.label ||
        userInfo.department;
      form.reset({
        username: userInfo.username,
        department: departmentName,
        name: userInfo.name,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        devices: [""],
      });
    }
  }, [userInfo, form]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

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
          <TextField
            control={form.control}
            name="department"
            label="학과"
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
            name="currentPassword"
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
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/user/mypage")}>
            취소
          </Button>
        </div>
      </form>
    </Form>
  );
}
