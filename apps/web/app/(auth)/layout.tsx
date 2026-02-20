import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Left Side: Branding and Hero */}
            <div className="relative hidden w-full flex-col justify-between bg-zinc-950 p-10 text-white lg:flex lg:w-1/2">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(59,130,246,0.2),transparent_50%),radial-gradient(circle_at_70%_50%,_rgba(74,222,128,0.15),transparent_50%)]" />

                <div className="relative z-20 flex items-center gap-2 text-2xl font-bold tracking-tight">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span>Gradeloop</span>
                </div>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-4">
                        <p className="text-4xl font-medium leading-tight">
                            "The future of learning is AI-integrated, personalized, and efficient."
                        </p>
                        <footer className="text-zinc-400">
                            Modern Learning Management System for the Next Generation
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side: Auth Forms */}
            <div className="flex flex-1 flex-col justify-center p-8 lg:w-1/2">
                <div className="mx-auto w-full max-w-[400px] space-y-6">
                    <div className="flex flex-col space-y-2 text-center lg:text-left">
                        {/* Mobile Logo */}
                        <div className="flex items-center gap-2 text-xl font-bold lg:hidden mb-6 justify-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span>Gradeloop</span>
                        </div>
                    </div>
                    {children}
                    <div className="text-center text-sm text-zinc-500">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                    </div>
                </div>
            </div>
        </div>
    );
}
