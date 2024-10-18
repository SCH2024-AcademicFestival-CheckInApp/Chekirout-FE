import * as z from "zod";

export const SigninSchema = z
  .object({
    username: z.string().length(8, {
      message: "학번은 8자리여야 합니다.",
    }),
    department: z.string().min(1, "학과를 선택해주세요"),
    name: z.string().min(1, "이름을 입력해주세요"),
    email: z
      .string()
      .email("이메일 형식이 올바르지 않습니다.")
      .refine((email) => email.endsWith("@sch.ac.kr"), {
        message: "학교 이메일 형식(@sch.ac.kr)만 사용 가능합니다.",
      }),
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
