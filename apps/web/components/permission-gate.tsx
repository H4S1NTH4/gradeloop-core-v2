"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { ReactNode } from "react";

interface PermissionGateProps {
    permission: string;
    children: ReactNode;
}

export function PermissionGate({ permission, children }: PermissionGateProps) {
    const { hasPermission } = usePermissions();

    if (!hasPermission(permission)) {
        return null;
    }

    return <>{children}</>;
}
