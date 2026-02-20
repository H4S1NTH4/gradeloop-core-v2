"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    rememberMe: z.boolean().default(false).optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    async function onSubmit(values: LoginValues) {
        setError(null);
        try {
            await login(values.email, values.password);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid email or password");
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and password to access your account
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                            {error}
                        </div>
                    )}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="m@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-primary hover:underline underline-offset-4"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-normal">
                                        Remember me for 30 days
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>

            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-primary hover:underline underline-offset-4">
                    Contact your administrator
                </Link>
            </div>
        </div>
    );
}
