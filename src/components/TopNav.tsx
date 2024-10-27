import Link from "next/link";
import { Bell, BellDot } from "lucide-react";
import Image from "next/image";

export default function TopNav() {
  return (
    <nav className="fixed z-[100] top-0 w-full max-w-[480px]">
      <div className="relative bg-white/95 backdrop-blur-md shadow-md rounded-b-3xl transition-all duration-300">
        <div className="absolute inset-x-0 -bottom-6 h-6 " />
        <div className="relative flex justify-between items-center h-[60px] px-6">
          <Link 
            href="/user" 
            className="flex flex-col items-start leading-tight transition-all duration-300 hover:scale-105 hover:translate-x-1"
          >
            <span className="text-xl font-black tracking-tight text-[#235698] leading-none transition-colors duration-300 hover:text-[#1a4276]">
              CHEKIROUT
            </span>
            <span className="text-[10px] font-semibold text-gray-500 tracking-tight uppercase transition-opacity duration-300 group-hover:opacity-80">
              2024 순천향대학교 SW융합대학 학술제
            </span>
          </Link>
          <button className="relative group p-2">
            <div className="absolute inset-0 bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform origin-center group-hover:scale-110" />
            <Bell className="w-6 h-6 text-gray-600 group-hover:text-[#235698] transition-all duration-300 ease-out transform group-hover:rotate-12" />
          </button>
        </div>
      </div>
    </nav>
  );
}
