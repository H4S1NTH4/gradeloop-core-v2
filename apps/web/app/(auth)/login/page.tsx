"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github } from "lucide-react";

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
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().default(false).optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<"student" | "instructor">("student");

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

      const currentUser = useAuthStore.getState().user;
      const role = currentUser?.role;

      if (currentUser?.requiresPasswordReset) {
        router.push("/auth/reset-required");
        return;
      }

      if (role === "admin" || role === "super_admin") {
        router.push("/admin/");
        return;
      }

      if (role === "instructor") {
        router.push("/instructor/");
        return;
      }

      if (role === "student") {
        router.push("/student/");
        return;
      }

      router.push("/");
    } catch (err: unknown) {
      const status = (
        err as { response?: { status?: number; data?: { message?: string } } }
      )?.response?.status;
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;

      if (status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (status === 403) {
        setError(
          message || "Your account is inactive or requires a password reset.",
        );
      } else if (status === 429) {
        setError(
          "Too many login attempts. Please wait a few minutes and try again.",
        );
      } else if (message) {
        setError(message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-lg">Please enter your details to sign in.</p>
      </div>

      {/* Role Toggle */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700/50">
        <button
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl text-sm transition-all duration-200",
            activeRole === "student"
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600 font-bold"
              : "text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white"
          )}
          onClick={() => setActiveRole("student")}
        >
          Student
        </button>
        <button
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl text-sm transition-all duration-200",
            activeRole === "instructor"
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600 font-bold"
              : "text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white"
          )}
          onClick={() => setActiveRole("instructor")}
        >
          Instructor
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-medium text-destructive animate-in zoom-in-95 duration-300">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email field */}
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

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <Lock className="size-5" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl focus-visible:ring-4 focus-visible:ring-primary/10 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-medium h-auto"
                      autoComplete="current-password"
                      {...field}
                    />
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember me */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 py-1 space-y-0">
                <FormControl>
                  <Checkbox
                    id="remember"
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <label className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none" htmlFor="remember">
                  Remember for 30 days
                </label>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full py-7 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98] h-auto"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing in..." : (
              <>
                Sign In
                <ArrowRight className="size-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-background-dark px-4 text-slate-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex items-center justify-center gap-3 py-6 px-4 border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-semibold text-slate-700 dark:text-slate-300 h-auto"
          disabled
        >
          <Github className="size-5" />
          <span className="text-sm">GitHub</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex items-center justify-center gap-3 py-6 px-4 border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-semibold text-slate-700 dark:text-slate-300 h-auto"
          disabled
        >
          <svg className="size-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-sm">Google</span>
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="#" className="font-bold text-primary hover:underline">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}

