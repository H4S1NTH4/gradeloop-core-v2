"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { RoleService } from "@/lib/api/role-service";
import { RolesTable } from "@/components/roles/roles-table";
import { RoleFormDialog } from "@/components/roles/role-form-dialog";

export default function RolesPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data: roles = [], isLoading: isRolesLoading, refetch: refetchRoles } = useQuery({
        queryKey: ["roles"],
        queryFn: RoleService.getRoles,
    });

    const { data: permissions = [], isLoading: isPermissionsLoading } = useQuery({
        queryKey: ["permissions"],
        queryFn: RoleService.getPermissions,
    });

    const isLoading = isRolesLoading || isPermissionsLoading;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading
                    title={`Roles (${roles.length})`}
                    description="Manage roles and their permissions."
                />
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Role
                </Button>
            </div>
            <Separator />

            <RolesTable roles={roles} permissions={permissions} isLoading={isLoading} />

            <RoleFormDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                role={null}
                permissions={permissions}
                onSuccess={() => refetchRoles()}
            />
        </div>
    );
}
