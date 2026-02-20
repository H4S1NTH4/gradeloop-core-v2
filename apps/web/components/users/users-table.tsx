import { User } from "@/lib/api/user-service";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    Trash2,
    RefreshCcw,
    MoreVertical,
    User as UserIcon,
    ShieldAlert
} from "lucide-react";
import { useState } from "react";

interface UsersTableProps {
    users: User[];
    isLoading: boolean;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function UsersTable({
    users,
    isLoading,
    onDelete,
    onRestore,
    page,
    totalPages,
    onPageChange,
}: UsersTableProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                        <tr className="text-left">
                            <th className="h-10 px-4 font-medium text-muted-foreground">Username</th>
                            <th className="h-10 px-4 font-medium text-muted-foreground">Email</th>
                            <th className="h-10 px-4 font-medium text-muted-foreground">Role</th>
                            <th className="h-10 px-4 font-medium text-muted-foreground">Status</th>
                            <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{user.username}</td>
                                    <td className="p-4 align-middle text-muted-foreground">{user.email}</td>
                                    <td className="p-4 align-middle">
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                            {user.role_name || "N/A"}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.is_active
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                }`}
                                        >
                                            {user.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.is_active ? (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDelete(user.id)}
                                                    title="Soft Delete"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onRestore(user.id)}
                                                    title="Restore"
                                                    className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
                                                >
                                                    <RefreshCcw className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                >
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages || 1}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
