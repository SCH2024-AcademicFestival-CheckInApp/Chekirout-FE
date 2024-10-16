"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottonNav";
import FloatingQRButton from "@/components/FloatingQRButton";
import TopNav from "@/components/TopNav";
import UserGlobalLayout from "@/components/UserGlobalLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFloatingQRButton =
    pathname === "/user/mypage" || pathname === "/user/mypage/edit";
  const hideNav = pathname === "/user/mypage/edit";

  return (
    <UserGlobalLayout>
      <TopNav />
      {children}
      {!hideFloatingQRButton && <FloatingQRButton />}
      {!hideNav && <BottomNav />}
    </UserGlobalLayout>
  );
}
