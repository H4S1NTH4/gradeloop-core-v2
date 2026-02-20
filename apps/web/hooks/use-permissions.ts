"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/auth-store";

/**
 * Hook to manage and check user permissions.
 * Now uses real user data from AuthStore (Zustand).
 */
export function usePermissions() {
    const { user } = useAuthStore();

    const memoizedPermissions = useMemo(() => user?.permissions || [], [user?.permissions]);

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
        hasAnyPermission,
        isAuthenticated: !!user
    };
}
