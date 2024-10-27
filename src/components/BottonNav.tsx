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
    <nav className="fixed bottom-0 w-full max-w-[480px] h-[72px] bg-white border-t border-gray-100  rounded-t-3xl">
      <div className="absolute inset-x-0 -top-4 h-4rounded-t-3xl" />
      <ul className="flex justify-around items-center h-full px-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link 
              href={item.href} 
              className={`relative flex flex-col items-center transition-all duration-300 ease-in-out ${
                pathname === item.href ? "-translate-y-1" : "hover:-translate-y-0.5"
              }`}
            >
              {pathname === item.href && (
                <span className="absolute -top-3 w-12 h-1 bg-[#235698] rounded-full" />
              )}
              <div className={`p-1.5 rounded-2xl transition-all duration-300 ${
                pathname === item.href 
                  ? "bg-[#235698]/10" 
                  : "hover:bg-gray-100"
              }`}>
                <item.icon
                  className={`w-6 h-6 transition-colors duration-300 ${
                    pathname === item.href 
                      ? "text-[#235698]" 
                      : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`mt-0.5 text-xs font-medium transition-colors duration-300 ${
                  pathname === item.href 
                    ? "text-[#235698] font-bold" 
                    : "text-gray-400"
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
