import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserService, CreateUserRequest } from "@/lib/api/user-service";
import apiClient from "@/lib/api/client";
import { X, Loader2 } from "lucide-react";

const createUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    role_id: z.string().min(1, "Role is required"),
    user_type: z.enum(["Student", "Employee"]),
    student_id: z.string().optional(),
    designation: z.string().optional(),
}).refine((data) => {
    if (data.user_type === "Student" && !data.student_id) {
        return false;
    }
    if (data.user_type === "Employee" && !data.designation) {
        return false;
    }
    return true;
}, {
    message: "Required field missing based on user type",
    path: ["user_type"], // Highlighting user type but could be specific field
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface Role {
    id: string;
    name: string;
}

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activationLink, setActivationLink] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            user_type: "Student",
        },
    });

    const userType = watch("user_type");

    useEffect(() => {
        if (isOpen) {
            fetchRoles();
            setActivationLink(null);
            reset();
        }
    }, [isOpen]);

    const fetchRoles = async () => {
        setIsLoadingRoles(true);
        try {
            // Assuming GET /roles returns { roles: Role[] } or similar
            // Adjust based on actual API response structure for roles
            const response = await apiClient.get("/roles");
            // Check if response.data is array or object with roles
            const rolesData = Array.isArray(response.data) ? response.data : response.data.roles || [];
            setRoles(rolesData);
        } catch (error) {
            console.error("Failed to fetch roles", error);
        } finally {
            setIsLoadingRoles(false);
        }
    };

    const onSubmit = async (data: CreateUserFormValues) => {
        setIsSubmitting(true);
        try {
            const payload: CreateUserRequest = {
                username: data.username,
                email: data.email,
                role_id: data.role_id,
                student_id: data.user_type === "Student" ? data.student_id : undefined,
                designation: data.user_type === "Employee" ? data.designation : undefined,
            };

            const response = await UserService.createUser(payload);
            setActivationLink(response.activation_link);
            onSuccess(); // Refresh table
        } catch (error) {
            console.error("Failed to create user", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg border animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Create New User</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {activationLink ? (
                    <div className="space-y-4">
                        <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                            <p className="font-medium mb-1">User created successfully!</p>
                            <p className="text-sm break-all">
                                Activation Link (Simulated):<br />
                                <a href={activationLink} className="underline" target="_blank" rel="noopener noreferrer">
                                    {activationLink}
                                </a>
                            </p>
                        </div>
                        <Button onClick={onClose} className="w-full">
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" {...register("username")} placeholder="jdoe" />
                            {errors.username && (
                                <span className="text-xs text-red-500">{errors.username.message}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
                            {errors.email && (
                                <span className="text-xs text-red-500">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            {isLoadingRoles ? (
                                <div className="text-sm text-muted-foreground">Loading roles...</div>
                            ) : (
                                <select
                                    id="role"
                                    {...register("role_id")}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.role_id && (
                                <span className="text-xs text-red-500">{errors.role_id.message}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user_type">User Type</Label>
                            <select
                                id="user_type"
                                {...register("user_type")}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Student">Student</option>
                                <option value="Employee">Employee</option>
                            </select>
                        </div>

                        {userType === "Student" && (
                            <div className="space-y-2">
                                <Label htmlFor="student_id">Student ID</Label>
                                <Input id="student_id" {...register("student_id")} placeholder="STU-001" />
                                {errors.student_id && (
                                    <span className="text-xs text-red-500">{errors.user_type?.message || "Student ID is required"}</span>
                                )}
                            </div>
                        )}

                        {userType === "Employee" && (
                            <div className="space-y-2">
                                <Label htmlFor="designation">Designation</Label>
                                <Input id="designation" {...register("designation")} placeholder="Lecturer" />
                                {errors.designation && (
                                    <span className="text-xs text-red-500">{errors.user_type?.message || "Designation is required"}</span>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create User
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
