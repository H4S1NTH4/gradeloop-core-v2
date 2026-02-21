import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full min-h-screen overflow-hidden bg-white dark:bg-background-dark font-sans">
            {/* Left Sidebar: Branding Area */}
            <div className="hidden lg:flex lg:w-[45%] bg-brand-mesh relative flex-col justify-between p-16 text-white overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-20">
                        <div className="size-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                            <svg className="text-white size-7" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Gradeloop</span>
                    </div>
                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tight text-white">Master the Art of Code.</h1>
                        <p className="text-xl text-white/70 leading-relaxed font-medium">
                            The all-in-one platform for automated grading, instant feedback, and seamless coding education.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 mt-16 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl ring-1 ring-white/10">
                    <div className="flex gap-2 mb-6">
                        <div className="size-3 rounded-full bg-red-400/80"></div>
                        <div className="size-3 rounded-full bg-yellow-400/80"></div>
                        <div className="size-3 rounded-full bg-green-400/80"></div>
                    </div>
                    <div className="font-mono text-base space-y-3">
                        <p><span className="text-blue-300">def</span> <span className="text-yellow-300">grade_submission</span>(student_id):</p>
                        <p className="pl-6 text-white/90">results = runner.<span className="text-blue-300">execute</span>(student_id)</p>
                        <p className="pl-6"><span className="text-blue-300">if</span> results.passed:</p>
                        <p className="pl-12 text-emerald-400 font-semibold">return "Excellent Work! 🚀"</p>
                        <p className="pl-6 text-white/40 italic">// Automated feedback delivered</p>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-6 text-sm font-medium text-white/40 mt-auto">
                    <span className="whitespace-nowrap">Trusted by 500+ Universities</span>
                    <div className="h-px w-full bg-white/10"></div>
                </div>
            </div>

            {/* Right Side: Form Area */}
            <div className="w-full lg:w-[55%] bg-white dark:bg-background-dark flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex justify-center mb-10">
                        <div className="flex items-center gap-3 text-brand-deep dark:text-white">
                            <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <svg className="text-white size-7" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Gradeloop</span>
                        </div>
                    </div>

                    {children}

                    {/* Footer links */}
                    <div className="pt-8 flex items-center justify-center gap-6">
                        <Link
                            href="/privacy"
                            className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
                        >
                            Terms
                        </Link>
                        <Link
                            href="/support"
                            className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
                        >
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

