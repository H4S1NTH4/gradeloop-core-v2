"use client";

import { useState, useEffect } from "react";
import { PermissionGate } from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UsersTable } from "@/components/users/users-table";
import { CreateUserModal } from "@/components/users/create-user-modal";
import { UserService, User } from "@/lib/api/user-service";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await UserService.getUsers(page, 10);
            setUsers(response.users);
            setTotalPages(Math.ceil(response.total_count / response.limit));
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handleDelete = async (id: string) => {
        try {
            await UserService.deleteUser(id);
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await UserService.restoreUser(id);
            fetchUsers();
        } catch (error) {
            console.error("Failed to restore user", error);
        }
    };

    return (
        <PermissionGate permission="manage_users">
            <div className="flex flex-col h-full space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create User
                    </Button>
                </div>

                <UsersTable
                    users={users}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />

                <CreateUserModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        fetchUsers();
                        // Don't close immediately to show activation link
                    }}
                />
            </div>
        </PermissionGate>
    );
}
