"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail, KeyRound } from "lucide-react";

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
import apiClient from "@/lib/api/client";

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotValues) {
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await apiClient.post("/auth/forgot-password", {
        email: values.email,
      });

      setStatus("success");

      // Redirect back to login after a short delay so the user sees the confirmation
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const status = (
        err as { response?: { status?: number; data?: { message?: string } } }
      )?.response?.status;
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;

      if (status === 429) {
        setErrorMessage(
          "Too many requests. Please wait a few minutes and try again.",
        );
      } else if (message) {
        setErrorMessage(message);
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }

      setStatus("error");
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
          <Mail className="h-10 w-10 text-emerald-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Check your inbox
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            If an account exists for{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {form.getValues("email")}
            </span>
            , you will receive a password reset link shortly.
          </p>
        </div>
        <div className="space-y-4 pt-4">
          <p className="text-sm font-medium text-slate-400 animate-pulse">
            Redirecting you back to login…
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
      {/* Icon + heading */}
      <div className="space-y-6 text-center lg:text-left">
        <div className="inline-flex lg:flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20 shadow-sm ring-1 ring-primary/20">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-3">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            No worries! Enter your email address and we&apos;ll send you a link
            to reset your password.
          </p>
        </div>
      </div>

      {/* Error banner */}
      {status === "error" && errorMessage && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-medium text-destructive animate-in zoom-in-95 duration-300">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <Mail className="size-5" />
                    </div>
                    <Input
                      type="email"
                      placeholder="name@university.edu"
                      className="w-full pl-12 pr-4 py-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl focus-visible:ring-4 focus-visible:ring-primary/10 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-medium h-auto"
                      autoComplete="email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full py-7 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98] h-auto group"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              "Sending reset link…"
            ) : (
              <>
                Send Reset Link
                <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Back to login */}
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

