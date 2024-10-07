"use client";
import { usePathname } from "next/navigation";
import { House, CalendarCheck, Ticket, SquareUserRound } from "lucide-react";
import Link from "next/link";
const navItems = [
  { icon: House, href: "/user", label: "홈" },
  { icon: CalendarCheck, href: "/user/event", label: "일정" },
  { icon: Ticket, href: "/user/record", label: "내역" },
  { icon: SquareUserRound, href: "/user/mypage", label: "MY" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] h-[54px] bg-white border-t border-gray-200">
      <ul className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="flex flex-col items-center">
              <item.icon
                className={`w-6 h-6 ${
                  pathname === item.href ? "text-[#235698]" : "text-slate-400"
                }`}
              />
              <span
                className={`text-xs ${
                  pathname === item.href ? "text-[#235698]" : "text-slate-400"
                }`}>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
