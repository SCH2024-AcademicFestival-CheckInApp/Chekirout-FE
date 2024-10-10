"use client";

import { useEffect, useState } from "react";
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
import axios from "axios";

export default function EditMyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { userInfo, isLoading } = useUserInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function onSubmit(values: EditProfileFormData) {
    setIsSubmitting(true);
    try {
      if (values.newPassword || values.currentPassword) {
        if (!values.currentPassword) {
          form.setError("currentPassword", {
            type: "manual",
            message: "현재 비밀번호를 입력해주세요.",
          });
          setIsSubmitting(false);

          return;
        }

        if (values.newPassword) {
          if (values.currentPassword === values.newPassword) {
            form.setError("newPassword", {
              type: "manual",
              message: "새로운 비밀번호를 입력해주세요.",
            });
            setIsSubmitting(false);
            return;
          }

          if (values.newPassword.length < 8) {
            form.setError("newPassword", {
              type: "manual",
              message: "비밀번호는 8자리 이상이어야 합니다.",
            });
            setIsSubmitting(false);
            return;
          }

          if (!values.confirmPassword) {
            form.setError("confirmPassword", {
              type: "manual",
              message: "새로운 비밀번호 확인을 입력해주세요.",
            });
            setIsSubmitting(false);
            return;
          }

          if (values.newPassword !== values.confirmPassword) {
            form.setError("confirmPassword", {
              type: "manual",
              message: "비밀번호가 일치하지 않습니다. 다시 입력해주세요.",
            });
            setIsSubmitting(false);
            return;
          }

          // 비밀번호 변경 API 호출
          const accessToken = localStorage.getItem("accessToken");
          try {
            await axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/change-password`,
              {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
          } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
              if (error.response.status === 400) {
                form.setError("currentPassword", {
                  type: "manual",
                  message:
                    "현재 비밀번호가 일치하지 않습니다. 다시 입력해주세요.",
                });
              } else if (error.response.status === 403) {
                toast({
                  title: "권한이 없습니다.",
                  description:
                    "비밀번호 변경 권한이 없습니다. 관리자에게 문의해주세요.",
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "오류가 발생했습니다.",
                  description: "잠시 후 다시 시도해주세요.",
                  variant: "destructive",
                });
              }
              setIsSubmitting(false);
              return;
            }
            throw error;
          }
        }
      }

      // 다른 정보 업데이트 로직(api 아직 없음)
      toast({
        title: "정보가 수정되었습니다.",
        description: "변경사항이 성공적으로 저장되었습니다.",
      });
      router.push("/user/mypage");
    } catch (error) {
      console.error(error);
      toast({
        title: "오류가 발생했습니다.",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : "저장하기"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/user/mypage")}
            disabled={isSubmitting}>
            취소
          </Button>
        </div>
      </form>
    </Form>
  );
}
