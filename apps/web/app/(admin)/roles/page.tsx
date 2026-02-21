"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Lock } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock data - replace with actual API calls
const mockRoles = [
    { id: "1", name: "admin", description: "Full system access", isSystem: true, userCount: 5 },
    { id: "2", name: "instructor", description: "Course management access", isSystem: true, userCount: 24 },
    { id: "3", name: "student", description: "Student access", isSystem: true, userCount: 150 },
    { id: "4", name: "ta", description: "Teaching assistant", isSystem: false, userCount: 12 },
];

const mockPermissions = [
    "manage_users",
    "manage_roles",
    "manage_courses",
    "view_reports",
    "manage_enrollments",
];

export default function RolesPage() {
    const [roles] = useState(mockRoles);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const handleDelete = (roleId: string) => {
        setSelectedRole(roleId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        // TODO: Implement delete logic
        setDeleteDialogOpen(false);
        setSelectedRole(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
                    <p className="text-muted-foreground">Manage roles and their permissions</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Role
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Users</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        {role.name}
                                    </div>
                                </TableCell>
                                <TableCell>{role.description}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{role.userCount} users</Badge>
                                </TableCell>
                                <TableCell>
                                    {role.isSystem ? (
                                        <Badge variant="secondary">
                                            <Lock className="mr-1 h-3 w-3" />
                                            System
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Custom</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Permissions</DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            {!role.isSystem && (
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDelete(role.id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="rounded-md border p-4">
                <h3 className="text-lg font-semibold mb-4">Available Permissions</h3>
                <div className="flex flex-wrap gap-2">
                    {mockPermissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="font-mono">
                            {permission}
                        </Badge>
                    ))}
                </div>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Role</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this role? This action cannot be undone.
                            Users with this role will need to be reassigned.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
