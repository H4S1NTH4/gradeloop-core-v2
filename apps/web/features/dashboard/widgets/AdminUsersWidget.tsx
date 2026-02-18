import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AdminUsersWidget() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>System user overview</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold mb-2">1,250</div>
                <p className="text-xs text-muted-foreground mb-4">Total registered users</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/admin/users">Manage Users</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
