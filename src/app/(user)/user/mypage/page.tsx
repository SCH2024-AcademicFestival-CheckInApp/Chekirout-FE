"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UserInfo {
  name: string;   
  department: string;   
  studentId: string;  
}

export default function MyPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/login");
      return;
    }
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        router.push("/login");
        return;
      }
    
      try {
        const response = await axios.get(
          "http://ec2-15-165-241-189.ap-northeast-2.compute.amazonaws.com:8080/api/v1/users/profile",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, [router]);
  
  return (
    <main className="relative flex flex-col items-center">
      <div className="relative">
        <Image src="/assets/Card.png" alt="카드" width={332} height={480} />
        <div className="absolute top-4 right-4 text-right text-white">
          <p className="font-bold text-2xl">{userInfo?.name}</p>
          <p className="text-base">{userInfo?.department}</p>
          <p className="text-base">{userInfo?.studentId}</p>
        </div>
      </div>
      <Link href="/user/mypage/edit" passHref>
        <Button className="mt-4 flex items-center gap-2 bg-white text-slate-900 shadow-sm rounded-full w-32 hover:bg-slate-900 hover:text-white">
          <Edit className="w-4 h-4" />
          수정하기
        </Button>
      </Link>
    </main>
  );
}
