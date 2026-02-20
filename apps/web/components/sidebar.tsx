"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, NavItem } from "@/lib/nav-config";
import { filterNavByPermissions } from "@/lib/permission-utils";
import { usePermissions } from "@/hooks/use-permissions";
import { GraduationCap, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
    const pathname = usePathname();
    const { permissions, user } = usePermissions();
    const filteredNav = filterNavByPermissions(NAV_ITEMS, permissions);

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 flex-col border-r bg-white dark:bg-zinc-950 transition-all duration-300 ease-in-out hidden md:flex">
            <div className="flex h-14 items-center gap-2 border-b px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
                    <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">Gradeloop</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {filteredNav.map((item) => (
                    <SidebarItem key={item.href} item={item} pathname={pathname} />
                ))}
            </nav>

            <div className="border-t p-4 mt-auto">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 font-semibold text-xs text-primary">
                        {user.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
    const isActive = pathname === item.href || (item.children && pathname.startsWith(item.href));
    const [isOpen, setIsOpen] = useState(isActive);

    if (item.children) {
        return (
            <div className="space-y-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 group",
                        isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <span className={cn(isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform opacity-50", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                    <div className="ml-10 space-y-1 py-1">
                        {item.children.map((child) => (
                            <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                    "block rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900",
                                    pathname === child.href ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {child.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 group",
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
            )}
        >
            <span className={cn(isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
                {item.icon}
            </span>
            <span>{item.label}</span>
        </Link>
    );
}
