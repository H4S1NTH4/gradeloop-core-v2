import React from "react";
import { StatsWidget } from "@/features/dashboard/widgets/StatsWidget";
import { ActivityWidget } from "@/features/dashboard/widgets/ActivityWidget";
import { AdminUsersWidget } from "@/features/dashboard/widgets/AdminUsersWidget";

export type DashboardWidget = {
    id: string;
    component: React.ComponentType;
    label: string;
    description?: string;
    requiredPermissions?: string[]; // e.g. ['iam:users:read']
    requiredRoles?: string[];       // e.g. ['admin', 'student']
    gridSpan?: { sm?: number; md?: number; lg?: number }; // col-span
};

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
    {
        id: "general-stats",
        component: StatsWidget,
        label: "General Stats",
        gridSpan: { lg: 1 }
    },
    {
        id: "recent-activity",
        component: ActivityWidget,
        label: "Recent Activity",
        gridSpan: { lg: 2 }
    },
    {
        id: "admin-users",
        component: AdminUsersWidget,
        label: "User Statistics",
        requiredPermissions: ["iam:users:read"],
        requiredRoles: ["admin"],
        gridSpan: { lg: 1 }
    }
];
