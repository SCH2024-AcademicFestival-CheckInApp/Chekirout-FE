"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TextField, PasswordField } from "@/components/FormField";
import { Device } from "@/components/Device";

const formSchema = z
  .object({
    studentId: z.string(),
    department: z.string(),
    name: z.string(),
    email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
    phoneNumber: z
      .string()
      .min(10, { message: "올바른 전화번호를 입력해주세요." }),
    password: z.string().min(6, { message: "현재 비밀번호를 입력해주세요." }),
    newPassword: z
      .string()
      .min(6, { message: "새 비밀번호는 최소 6자 이상이어야 합니다." }),
    confirmPassword: z.string(),
    devices: z
      .array(z.string())
      .max(2, "최대 2개의 디바이스만 등록할 수 있습니다."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "새 비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

const departments = [
  "컴퓨터소프트웨어공학과",
  "의료 IT공학과",
  "정보보호학과",
  "사물인터넷학과",
  "메타버스게임학과",
];

const DepartmentSelect = ({ control }: { control: any }) => (
  <FormField
    control={control}
    name="department"
    render={({ field }) => (
      <FormItem>
        <FormLabel>학과</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="학과를 선택하세요" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default function EditMyPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "20204023",
      department: "컴퓨터소프트웨어공학과",
      name: "황다경",
      email: "",
      phoneNumber: "",
      password: "",
      newPassword: "",
      confirmPassword: "",
      devices: [""],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
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
            name="studentId"
            label="학번"
            disabled
          />
          <DepartmentSelect control={form.control} />
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
