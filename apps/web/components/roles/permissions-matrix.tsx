"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Permission } from "@/lib/api/role-service";
import { useMemo } from "react";

interface PermissionsMatrixProps {
    permissions: Permission[];
    selectedPermissionIds: string[];
    onSelectionChange: (ids: string[]) => void;
    disabled?: boolean;
}

export function PermissionsMatrix({
    permissions,
    selectedPermissionIds,
    onSelectionChange,
    disabled
}: PermissionsMatrixProps) {
    // Group permissions by resource (e.g., "users:read" -> "users" group)
    const groupedPermissions = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        permissions.forEach(p => {
            const [resource] = p.name.split(":");
            if (!groups[resource]) {
                groups[resource] = [];
            }
            groups[resource].push(p);
        });
        return groups;
    }, [permissions]);

    const handleToggle = (permissionId: string, checked: boolean) => {
        if (checked) {
            onSelectionChange([...selectedPermissionIds, permissionId]);
        } else {
            onSelectionChange(selectedPermissionIds.filter(id => id !== permissionId));
        }
    };

    const handleGroupToggle = (groupPermissions: Permission[], checked: boolean) => {
        const groupIds = groupPermissions.map(p => p.id);
        let newSelection = [...selectedPermissionIds];

        if (checked) {
            // Add all missing ids from this group
            groupIds.forEach(id => {
                if (!newSelection.includes(id)) {
                    newSelection.push(id);
                }
            });
        } else {
            // Remove all ids from this group
            newSelection = newSelection.filter(id => !groupIds.includes(id));
        }
        onSelectionChange(newSelection);
    };

    return (
        <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([collection, groupPerms]) => {
                const allSelected = groupPerms.every(p => selectedPermissionIds.includes(p.id));
                const someSelected = groupPerms.some(p => selectedPermissionIds.includes(p.id));
                const isIndeterminate = someSelected && !allSelected;

                return (
                    <div key={collection} className="border rounded-lg p-4 bg-muted/20">
                        <div className="flex items-center space-x-2 mb-4">
                            <Checkbox
                                id={`group-${collection}`}
                                checked={allSelected || (isIndeterminate ? "indeterminate" : false)}
                                onCheckedChange={(checked) => handleGroupToggle(groupPerms, checked === true)}
                                disabled={disabled}
                            />
                            <Label htmlFor={`group-${collection}`} className="text-base font-semibold capitalize">
                                {collection} Management
                            </Label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-6">
                            {groupPerms.map((permission) => (
                                <div key={permission.id} className="flex items-start space-x-2">
                                    <Checkbox
                                        id={permission.id}
                                        checked={selectedPermissionIds.includes(permission.id)}
                                        onCheckedChange={(checked) => handleToggle(permission.id, checked === true)}
                                        disabled={disabled}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor={permission.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {permission.name}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            {permission.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
