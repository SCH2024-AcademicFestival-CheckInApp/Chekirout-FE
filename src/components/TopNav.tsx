import Link from "next/link";
import { Bell } from "lucide-react";

export default function TopNav() {
  return (
    <nav className="fixed top-0 w-full max-w-[480px] h-[54px] bg-white border-b border-gray-200 flex justify-between items-center px-4">
      <Link href="/user" className="text-xl font-bold text-[#235698]">
        Chekirout
      </Link>
      <button className="text-gray-500">
        <Bell className="w-6 h-6" />
      </button>
    </nav>
  );
}
