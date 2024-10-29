"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/hooks/useUserInfo";
import { departments } from "@/constants/constants";

export default function MyPage() {
  const { userInfo, isLoading } = useUserInfo();
  const router = useRouter();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const departmentName =
    departments.find((dept) => dept.value === userInfo?.department)?.label ||
    userInfo?.department;

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  const isAdmin = userInfo?.role === 'ADMIN' || userInfo?.role === 'MASTER';

  return (
    <main className="relative flex flex-col items-center">
      <div className="relative mt-20">
        <Image src="/assets/Card.png" alt="카드" width={332} height={480} />
        <div className="absolute top-4 right-4 text-right text-white">
          <p className="font-bold text-2xl">{userInfo?.name}</p>
          <p className="text-base">{departmentName}</p>
          <p className="text-base">{userInfo?.username}</p>
        </div>
      </div>
      <Link href="/user/mypage/edit" passHref>
        <Button className="mt-4 flex items-center gap-2 bg-white text-slate-900 shadow-sm rounded-full w-32 hover:bg-slate-900 hover:text-white">
          <Edit className="w-4 h-4" />
          수정하기
        </Button>
      </Link>

      <div className="mt-8 mb-24 flex gap-4">
        {isAdmin && (
          <>
            <Link href="/admin" className="text-gray-500 hover:underline">
              관리자 페이지
            </Link>
            <div className="text-gray-500"> | </div>
          </>
        )}
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:underline"
        >
          로그아웃
        </button>
      </div>
    </main>
  );
}
