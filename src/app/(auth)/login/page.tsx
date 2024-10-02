"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  username: z.string().min(8, {
    message: "학번 8자리를 입력해주세요.",
  }),
  password: z.string().min(6, {
    message: "비밀번호는 최소 8자 이상이어야 합니다.",
  }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("로그인 시도");
  }

  return (
    <main className="w-[480px] h-screen flex flex-col items-center bg-white">
      <div className="text-center pt-[200px] mb-20">
        <div className="text-5xl font-black text-[#235698]">로그인</div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[328px] space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-[328px]">
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input
                    placeholder="아이디를 입력하세요"
                    {...field}
                    className="w-full box-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-[328px]">
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    {...field}
                    className="w-full box-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-[328px] h-11 bg-[#235698] text-white font-semibold rounded-lg">
            로그인
          </Button>
        </form>
      </Form>
    </main>
  );
}
