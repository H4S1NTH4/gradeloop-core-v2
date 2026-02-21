"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Lock, ArrowRight } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordIndicator } from "@/components/password-indicator";
import apiClient from "@/lib/api/client";

// ── Validation ──────────────────────────────────────────────────────────────

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((v) => /[A-Z]/.test(v), {
        message: "Must contain at least one uppercase letter",
      })
      .refine((v) => /[a-z]/.test(v), {
        message: "Must contain at least one lowercase letter",
      })
      .refine((v) => /[0-9]/.test(v), {
        message: "Must contain at least one digit",
      })
      .refine((v) => /[^A-Za-z0-9]/.test(v), {
        message: "Must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetValues = z.infer<typeof resetSchema>;

// ── Inner component (uses useSearchParams – needs Suspense wrapper) ──────────

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const watchedPassword = form.watch("password");

  useEffect(() => {
    if (!token) {
      setErrorMessage(
        "Reset token is missing. Please use the link from your email.",
      );
    }
  }, [token]);

  async function onSubmit(values: ResetValues) {
    setErrorMessage(null);

    if (!token) {
      setErrorMessage(
        "Reset token is missing. Please use the link from your email.",
      );
      return;
    }

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        new_password: values.password,
      });

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const status = (
        err as { response?: { status?: number; data?: { message?: string } } }
      )?.response?.status;
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;

      if (status === 400 && message) {
        setErrorMessage(message);
      } else if (status === 401) {
        setErrorMessage(
          "Invalid or expired reset token. Please request a new reset link.",
        );
      } else if (status === 429) {
        setErrorMessage(
          "Too many requests. Please wait a few minutes and try again.",
        );
      } else {
        setErrorMessage(
          message ?? "Unable to reset password. Please try again.",
        );
      }
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
          <ShieldCheck className="h-10 w-10 text-emerald-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Password updated!
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Your password has been reset successfully. Redirecting you to
            login&hellip;
          </p>
        </div>
        <div className="space-y-4 pt-4">
          <p className="text-sm font-medium text-slate-400 animate-pulse">
            Please wait...
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Heading */}
      <div className="text-center lg:text-left">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Reset Your Password
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-lg">
          Choose a new secure password. This link expires after one hour.
        </p>
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-medium text-destructive animate-in zoom-in-95 duration-300">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* New password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  New Password
                </FormLabel>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock className="size-5" />
                  </div>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a new password"
                      className="w-full pl-12 pr-12 py-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl focus-visible:ring-4 focus-visible:ring-primary/10 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-medium h-auto"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </FormLabel>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock className="size-5" />
                  </div>
                  <FormControl>
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className="w-full pl-12 pr-12 py-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl focus-visible:ring-4 focus-visible:ring-primary/10 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-medium h-auto"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Live strength checklist */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <PasswordIndicator password={watchedPassword} />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full py-7 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98] h-auto group"
            disabled={form.formState.isSubmitting || !token}
          >
            {form.formState.isSubmitting ? "Updating…" : (
              <>
                Update Password
                <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Back link */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center lg:justify-start">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}

// ── Page export (Suspense boundary required by Next.js for useSearchParams) ──

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="space-y-3">
            <div className="h-10 w-64 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-6 w-80 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-20 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-20 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-24 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

