"use client";

import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoleBadgeProps extends BadgeProps {
    role: string;
    className?: string;
}

export function RoleBadge({ role, className, ...props }: RoleBadgeProps) {
    const getVariant = (role: string): BadgeProps["variant"] => {
        switch (role) {
            case "admin":
            case "super_admin":
                return "destructive";
            case "instructor":
                return "default";
            case "student":
                return "secondary";
            default:
                return "outline";
        }
    };

    const formatRole = (role: string) => {
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <Badge
            variant={getVariant(role)}
            className={cn("font-medium", className)}
            {...props}
        >
            {formatRole(role)}
        </Badge>
    );
}
