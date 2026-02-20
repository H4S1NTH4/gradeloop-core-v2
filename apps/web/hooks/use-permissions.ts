"use client";

import { useMemo } from "react";

/**
 * Mock user data with permissions.
 * In a real application, this would come from a JWT claim or an API endpoint (/me).
 */
const MOCK_USER = {
    id: "admin-uuid",
    name: "Admin User",
    email: "admin@gradeloop.com",
    permissions: [
        "dashboard.read",
        "users.read",
        "users.write",
        "courses.read",
        "academics.manage",
        "enrollments.read",
        "settings.read"
    ]
};

export function usePermissions() {
    // For now, we use the mock user. In production, this would be fetched from state/API.
    const user = MOCK_USER;

    const memoizedPermissions = useMemo(() => user.permissions, [user.permissions]);

    const hasPermission = (requiredPermission: string) => {
        return memoizedPermissions.includes(requiredPermission);
    };

    const hasAnyPermission = (requiredPermissions: string[]) => {
        return requiredPermissions.some(permission => memoizedPermissions.includes(permission));
    };

    return {
        user,
        permissions: memoizedPermissions,
        hasPermission,
        hasAnyPermission
    };
}
