"use client";

import React, { useState } from "react";
import {
  Users,
  Folder,
  Calendar,
  Target,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav
      className={`bg-[#235698] text-white ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen p-4 flex flex-col justify-between transition-all duration-300`}>
      <div>
        <div className="flex justify-between items-center mb-6">
          {!isCollapsed && (
            <div className="text-2xl font-bold text-center">chekirout</div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-full hover:bg-blue-600">
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
        <ul>
          <SidebarItem
            icon={<Users size={20} />}
            title="유저 관리"
            href="/admin/userManage"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Folder size={20} />}
            title="프로그램 관리"
            href="/admin/programManage"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Calendar size={20} />}
            title="참여 기록 관리"
            href="/admin/participation"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Target size={20} />}
            title="추첨 대상 관리"
            href="/admin/drawManage"
            isCollapsed={isCollapsed}>
            {!isCollapsed && (
              <>
                <SubItem title="추첨" href="/admin/drawManage/draw" />
                <SubItem title="당첨자 확인" href="/admin/drawManage/winners" />
                <SubItem title="수령 확인" href="/admin/drawManage/claim" />
              </>
            )}
          </SidebarItem>
        </ul>
      </div>
      <div>
        <ul>
          <SidebarItem
            icon={<BookOpen size={20} />}
            title="학생용 페이지"
            href="/user"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<LogOut size={20} />}
            title="로그아웃"
            href="/"
            isCollapsed={isCollapsed}
          />
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
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  href,
  children,
  isCollapsed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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
            if (children && !isCollapsed) {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}>
          {icon}
          {!isCollapsed && <span className="ml-2">{title}</span>}
        </button>
      </Link>
      {children && isOpen && !isCollapsed && (
        <ul className="ml-4 mt-2">{children}</ul>
      )}
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
