"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  ChevronDown,
  LayoutDashboard,
  Users,
  Shield,
  LogOut,
  UserCircle,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

type Role = "admin" | "super_admin" | "instructor" | "student";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const getNavItemsByRole = (role: Role): NavItem[] => {
  switch (role) {
    case "admin":
    case "super_admin":
      return [
        {
          label: "Dashboard",
          href: "/admin/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          label: "Users",
          href: "/admin/users",
          icon: <Users className="h-4 w-4" />,
        },
        {
          label: "Roles",
          href: "/admin/roles",
          icon: <Shield className="h-4 w-4" />,
        },
        {
          label: "Profile",
          href: "/admin/profile",
          icon: <UserCircle className="h-4 w-4" />,
        },
      ];
    case "instructor":
      return [
        {
          label: "Dashboard",
          href: "/instructor/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          label: "My Courses",
          href: "/instructor/courses",
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          label: "Students",
          href: "/instructor/students",
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          label: "Profile",
          href: "/instructor/profile",
          icon: <UserCircle className="h-4 w-4" />,
        },
      ];
    case "student":
      return [
        {
          label: "Dashboard",
          href: "/student/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          label: "My Courses",
          href: "/student/my-courses",
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          label: "Enrollments",
          href: "/student/enrollments",
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          label: "Profile",
          href: "/student/profile",
          icon: <UserCircle className="h-4 w-4" />,
        },
      ];
    default:
      return [];
  }
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Determine role from user or pathname
  const role: Role =
    user?.role === "admin" || user?.role === "super_admin"
      ? "admin"
      : (user?.role as Role) || "admin";

  const navItems = getNavItemsByRole(role);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 flex-col border-r bg-white dark:bg-zinc-950 transition-all duration-300 ease-in-out hidden md:flex">
      <div className="flex h-14 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Gradeloop</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <SidebarItem key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="border-t p-4 mt-auto space-y-2">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 font-semibold text-xs text-primary">
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "U"}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium">{user?.name || "User"}</span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email || ""}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 group",
        isActive ? "text-primary bg-primary/5" : "text-muted-foreground",
      )}
    >
      <span
        className={cn(
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {item.icon}
      </span>
      <span>{item.label}</span>
    </Link>
  );
}
