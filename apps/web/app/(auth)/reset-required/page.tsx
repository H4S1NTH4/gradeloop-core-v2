"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Mail } from "lucide-react";

const resetSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

type ResetValues = z.infer<typeof resetSchema>;

export default function ResetRequiredPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ResetValues>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(values: ResetValues) {
        // TODO: Call API to send reset email
        console.log("Reset requested for:", values.email);
        setIsSubmitted(true);
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                    <Mail className="h-5 w-5" />
                    <span className="text-sm font-medium">Password Reset Required</span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">Reset Your Password</h1>
                <p className="text-sm text-muted-foreground">
                    For security reasons, you need to reset your password before continuing.
                </p>
            </div>

            {!isSubmitted ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                </Form>
            ) : (
                <div className="space-y-4 text-center">
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                            If an account exists with that email, a password reset link has been sent.
                        </p>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/auth/login">Back to Login</Link>
                    </Button>
                </div>
            )}

            <div className="text-center text-sm">
                Remember your password?{" "}
                <Link
                    href="/auth/login"
                    className="font-medium text-primary hover:underline underline-offset-4"
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
}
