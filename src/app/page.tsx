"use client"

import Splash from "@/components/Splash";
import { Button } from "@/components/ui/button";
import UserGlobalLayout from "@/components/UserGlobalLayout";
import Image from "next/image";

export default function Home() {
  return (
    <UserGlobalLayout>
    <main className="w-full h-screen flex flex-col justify-between items-center bg-white ">
      <Splash />
      <div className="text-center pt-[120px]">
        <div className="text-lg text-[#235698] mb-2">2024 SCH SW•AI Festival</div>
        <div className="text-5xl font-black text-[#235698]">CHEKIROUT</div>
        <div className="text-sm text-gray-500 mt-2">제 1회 SW융합대학 학술제 통합관리시스템</div>
      </div>
      <div className="flex-grow flex justify-center items-center">
        <Image src="/assets/icon512.png" alt="logo" width={240} height={240} />
      </div>
      <div className="flex flex-col space-y-4 py-8">
        <Button
          className="w-[328px] h-11 bg-[#235698] text-white font-semibold rounded-lg"
          onClick={() => window.location.href = '/login'}
        >
          로그인
        </Button>
        <Button
          className="w-[328px] h-11 bg-[#acacac] text-white font-semibold rounded-lg"
          onClick={() => window.location.href = '/signin'}
        >
          회원가입
        </Button>
      </div>
    </main>
    </UserGlobalLayout>
  );
}
