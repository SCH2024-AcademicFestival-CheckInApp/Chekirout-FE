import * as z from "zod";

export const EditProfileSchema = z
  .object({
    username: z.string(),
    department: z.string(),
    name: z.string(),
    email: z
      .string()
      .email({ message: "유효한 이메일 주소를 입력해주세요." })
      .or(z.literal("")),
    phoneNumber: z
      .string()
      .min(10, { message: "올바른 전화번호를 입력해주세요." })
      .or(z.literal("")),
    currentPassword: z
      .string()
      .min(1, "현재 비밀번호를 입력해주세요.")
      .or(z.literal("")),
    newPassword: z
      .string()
      .min(6, "새 비밀번호는 최소 6자 이상이어야 합니다.")
      .or(z.literal("")),
    confirmPassword: z.string().or(z.literal("")),
    devices: z
      .array(z.string())
      .max(2, "최대 2개의 디바이스만 등록할 수 있습니다."),
  })
  .refine(
    (data) => {
      if (data.newPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "새 비밀번호가 일치하지 않습니다.",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword) {
        return !!data.currentPassword;
      }
      return true;
    },
    {
      message: "새 비밀번호를 설정하려면 현재 비밀번호를 입력해야 합니다.",
      path: ["currentPassword"],
    }
  );

export type EditProfileFormData = z.infer<typeof EditProfileSchema>;
