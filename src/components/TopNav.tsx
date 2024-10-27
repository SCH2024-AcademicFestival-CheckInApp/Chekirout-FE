import Link from "next/link";
import { Bell, BellDot } from "lucide-react";
import Image from "next/image";

export default function TopNav() {
  return (
    <nav className="fixed z-[100] top-0 w-full max-w-[480px] bg-white/95 backdrop-blur-md shadow-sm">
      <div className="absolute inset-x-0 -bottom-4 h-4 bg-gradient-to-b from-white/50 to-transparent" />
      <div className="relative flex justify-between items-center h-[60px] px-5">
        <Link 
          href="/user" 
          className="flex flex-col items-start leading-tight transition-transform hover:scale-105"
        >
          <span className="text-xl font-black tracking-tight text-[#235698] leading-none">
            CHEKIROUT
          </span>
          <span className="text-[10px] font-semibold text-gray-500 tracking-tight uppercase">
            2024 순천향대학교 SW융합대학 학술제
          </span>
        </Link>
        <button className="relative group">
          <div className="absolute inset-0 bg-gray-100 scale-90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <Bell className="w-6 h-6 text-gray-600 group-hover:text-[#235698] transition-colors duration-300 relative" />
        </button>
      </div>
    </nav>
  );
}
