"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Role, Permission, RoleService } from "@/lib/api/role-service";
import { PermissionsMatrix } from "./permissions-matrix";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const roleSchema = z.object({
    name: z.string().min(2, "Role name must be at least 2 characters"),
    permission_ids: z.array(z.string()).default([]),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role | null;
    permissions: Permission[];
    onSuccess: () => void;
}

export function RoleFormDialog({ open, onOpenChange, role, permissions, onSuccess }: RoleFormDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            permission_ids: [],
        },
    });

    useEffect(() => {
        if (role) {
            form.reset({
                name: role.name,
                permission_ids: role.permissions.map((p) => p.id),
            });
        } else {
            form.reset({
                name: "",
                permission_ids: [],
            });
        }
    }, [role, form, open]);

    const onSubmit = async (values: RoleFormValues) => {
        setIsLoading(true);
        try {
            if (role) {
                await RoleService.updateRole(role.id, values);
                toast({
                    title: "Role updated",
                    description: "The role has been successfully updated.",
                });
            } else {
                await RoleService.createRole(values);
                toast({
                    title: "Role created",
                    description: "The new role has been successfully created.",
                });
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save role:", error);
            toast({
                title: "Error",
                description: "Failed to save role. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
                    <DialogDescription>
                        {role ? "Update role details and permissions." : "Create a new role and assign permissions."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Content Moderator" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Unique name for the role.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="permission_ids"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permissions</FormLabel>
                                    <FormControl>
                                        <PermissionsMatrix
                                            permissions={permissions}
                                            selectedPermissionIds={field.value}
                                            onSelectionChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {role ? "Update Role" : "Create Role"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
