"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { User, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DashboardTopbar() {
    return (
        <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-neutral-900 w-full h-16 shrink-0">
            <div className="flex items-center gap-4">
                <Breadcrumbs />
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden md:flex">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-64 rounded-lg bg-zinc-50 pl-8 focus:bg-white dark:bg-zinc-900 dark:focus:bg-zinc-950"
                    />
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Bell className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
