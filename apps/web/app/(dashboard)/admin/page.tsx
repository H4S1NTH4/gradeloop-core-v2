import { AppLayout } from "@/components/app-layout";
import {
    Users,
    GraduationCap,
    BookOpen,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    UserPlus,
    Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
    return (
        <AppLayout>
            <div className="space-y-8 py-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening across the platform.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            Last 30 Days
                        </Button>
                        <Button>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Download Report
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Users"
                        value="12,482"
                        change="+12.5%"
                        trend="up"
                        icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StatCard
                        title="Active Courses"
                        value="342"
                        change="+4.2%"
                        trend="up"
                        icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StatCard
                        title="Total Students"
                        value="8,921"
                        change="-2.1%"
                        trend="down"
                        icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StatCard
                        title="System Uptime"
                        value="99.99%"
                        change="Stable"
                        trend="up"
                        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                    />
                </div>

                {/* Content grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="lg:col-span-4 border-none shadow-sm bg-white dark:bg-zinc-900">
                        <CardHeader>
                            <CardTitle>Recent Enrollment Activity</CardTitle>
                            <CardDescription>View the latest student enrollments across all courses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    { name: "Alice Johnson", email: "alice.j@university.edu", course: "Advanced React Patterns", initial: "AJ" },
                                    { name: "Bob Smith", email: "bob.smith@university.edu", course: "System Design 101", initial: "BS" },
                                    { name: "Charlie Davis", email: "charlie.d@university.edu", course: "Data Science Ethics", initial: "CD" },
                                    { name: "David Wilson", email: "david.w@university.edu", course: "UI/UX Fundamentals", initial: "DW" },
                                    { name: "Eve Miller", email: "eve.m@university.edu", course: "Backend Scalability", initial: "EM" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-medium">{item.initial}</span>
                                        </div>
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <p className="text-sm font-medium leading-none truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{item.email}</p>
                                        </div>
                                        <div className="text-xs font-medium text-zinc-500 whitespace-nowrap">
                                            {item.course}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-6 text-sm text-primary hover:text-primary/80">
                                View all activity
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3 border-none shadow-sm bg-white dark:bg-zinc-900">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Frequently used administrative tasks.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start h-11">
                                <UserPlus className="mr-3 h-4 w-4 text-primary" />
                                Onboard New Student
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-11">
                                <BookOpen className="mr-3 h-4 w-4 text-primary" />
                                Create New Course
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-11">
                                <Settings className="mr-3 h-4 w-4 text-primary" />
                                Configure System Settings
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, change, trend, icon }: { title: string, value: string, change: string, trend: "up" | "down", icon: React.ReactNode }) {
    return (
        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                    ) : (
                        <ArrowDownRight className="h-3 w-3 text-rose-500 mr-1" />
                    )}
                    <span className={trend === "up" ? "text-emerald-500 font-medium" : "text-rose-500 font-medium"}>{change}</span>
                    <span className="ml-1">from last month</span>
                </p>
            </CardContent>
        </Card>
    );
}
