import * as z from "zod";

export const SigninSchema = z
  .object({
    username: z.string().length(8, {
      message: "학번 8자리를 입력해주세요.",
    }),
    department: z.string().min(1, "학과를 선택해주세요"),
    name: z.string().min(1, "이름을 입력해주세요"),
    password: z.string().min(6, {
      message: "비밀번호는 최소 6자 이상이어야 합니다.",
    }),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "ADMIN"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SigninFormData = z.infer<typeof SigninSchema>;
