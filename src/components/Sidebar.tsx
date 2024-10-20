"use client";

import React from "react";
import {
  Users,
  Folder,
  Calendar,
  Target,
  BookOpen,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  return (
    <nav className="bg-[#235698] text-white w-64 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold mb-6 text-center">chekirout</div>
        <ul>
          <SidebarItem
            icon={<Users size={20} />}
            title="유저 관리"
            href="/admin/userManage"
          />
          <SidebarItem
            icon={<Folder size={20} />}
            title="프로그램 관리"
            href="/admin/programManage"
          />
          <SidebarItem
            icon={<Calendar size={20} />}
            title="참여 기록 관리"
            href="/admin/participation"
          />
          <SidebarItem
            icon={<Target size={20} />}
            title="추첨 대상 관리"
            href="/admin/drawManage">
            <SubItem title="추첨" href="/admin/drawManage/draw" />
            <SubItem title="당첨자 확인" href="/admin/drawManage/winners" />
            <SubItem title="수령 확인" href="/admin/drawManage/claim" />
          </SidebarItem>
        </ul>
      </div>
      <div>
        <ul>
          <SidebarItem
            icon={<BookOpen size={20} />}
            title="학생용 페이지"
            href="/user"
          />
          <SidebarItem icon={<LogOut size={20} />} title="로그아웃" href="/" />
        </ul>
      </div>
    </nav>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  children?: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  href,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <li className="mb-4">
      <Link href={href} passHref>
        <button
          className={`flex items-center w-full text-left ${
            isActive ? "bg-white bg-opacity-20" : ""
          } p-2 rounded`}
          onClick={(e) => {
            if (children) {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}>
          {icon}
          <span className="ml-2">{title}</span>
        </button>
      </Link>
      {children && isOpen && <ul className="ml-4 mt-2">{children}</ul>}
    </li>
  );
};

interface SubItemProps {
  title: string;
  href: string;
}

const SubItem: React.FC<SubItemProps> = ({ title, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li className="my-2">
      <Link
        href={href}
        className={`text-sm hover:text-gray-300 ${
          isActive ? "font-bold" : ""
        }`}>
        {title}
      </Link>
    </li>
  );
};

export default Sidebar;
