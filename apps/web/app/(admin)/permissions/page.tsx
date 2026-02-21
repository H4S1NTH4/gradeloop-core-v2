"use client";

import { Shield, Lock, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const permissions = [
    { id: "manage_users", name: "Manage Users", description: "Create, edit, and delete users", category: "Users" },
    { id: "manage_roles", name: "Manage Roles", description: "Create and modify roles", category: "Roles" },
    { id: "manage_courses", name: "Manage Courses", description: "Create and manage courses", category: "Courses" },
    { id: "manage_enrollments", name: "Manage Enrollments", description: "Handle student enrollments", category: "Courses" },
    { id: "view_reports", name: "View Reports", description: "Access analytics and reports", category: "Reports" },
    { id: "manage_settings", name: "Manage Settings", description: "Configure system settings", category: "Settings" },
];

const categories = ["Users", "Roles", "Courses", "Reports", "Settings"];

export default function PermissionsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Permissions</h1>
                <p className="text-muted-foreground">System permissions and their descriptions</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Available Permissions
                    </CardTitle>
                    <CardDescription>
                        Permissions are assigned to roles. Users inherit permissions from their assigned roles.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {categories.map((category) => (
                            <div key={category}>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">{category}</h3>
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {permissions
                                        .filter((p) => p.category === category)
                                        .map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-start gap-3 rounded-lg border p-4"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                                                    <Lock className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium">{permission.name}</p>
                                                        <Badge variant="outline" className="text-xs font-mono">
                                                            {permission.id}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {permission.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Permission Guidelines</CardTitle>
                    <CardDescription>Best practices for managing permissions</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Always follow the principle of least privilege - grant only necessary permissions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>System roles (admin, instructor, student) cannot be deleted</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Regularly audit role assignments and permissions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Create custom roles for specific use cases instead of modifying system roles</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
