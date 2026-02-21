"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";
import { TopNavbar } from "./top-navbar";
import { useAuth } from "@/hooks/use-auth";
import { getNavItemsForRole } from "@/lib/nav-config";
import { GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  const [open, setOpen] = React.useState(false);

  const navItems = React.useMemo(() => getNavItemsForRole(role), [role]);

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
      {/* Aceternity Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {navItems.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    label: link.label,
                    href: link.href,
                    icon: link.icon,
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Settings",
                href: "/settings",
                icon: (
                  <div className="h-5 w-5 flex-shrink-0 text-neutral-600 dark:text-neutral-400 group-hover/sidebar:text-primary dark:group-hover/sidebar:text-white transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Area with Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 px-4 backdrop-blur-md sm:px-6">
          <div className="mx-auto w-full max-w-7xl">
            <TopNavbar />
          </div>
        </header>

        {/* Main Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export const Logo = () => {
  const { open } = useSidebar();
  return (
    <Link
      href="/"
      className="flex items-center gap-3 overflow-hidden text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
        <GraduationCap className="h-5 w-5 text-white" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{
          opacity: open ? 1 : 0,
          display: open ? "inline-block" : "none",
        }}
        className="text-xl font-bold tracking-tight whitespace-nowrap"
      >
        Gradeloop
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20"
    >
      <GraduationCap className="h-5 w-5 text-white" />
    </Link>
  );
};
