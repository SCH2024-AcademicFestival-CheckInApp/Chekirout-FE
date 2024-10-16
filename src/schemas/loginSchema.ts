import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(8, {
    message: "학번 8자리를 입력해주세요.",
  }),
  password: z.string().min(6, {
    message: "비밀번호는 최소 8자 이상이어야 합니다.",
  }),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;