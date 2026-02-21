"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, UserPlus, TrendingUp } from "lucide-react";

// Mock data - replace with actual API calls
const stats = {
    totalCourses: 12,
    totalStudents: 342,
    recentEnrollments: 28,
    averageRating: 4.8,
};

export default function InstructorDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to the Instructor Dashboard</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 new this semester
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">
                            +45 from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Enrollments</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.recentEnrollments}</div>
                        <p className="text-xs text-muted-foreground">
                            +12 this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageRating}</div>
                        <p className="text-xs text-muted-foreground">
                            +0.3 from last semester
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Enrollments</CardTitle>
                        <CardDescription>Students who recently enrolled in your courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-xs text-primary">
                                        S{i}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">Student {i}</p>
                                        <p className="text-xs text-muted-foreground">Enrolled in Course {i}</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground">2h ago</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common instructor tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <button className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                <BookOpen className="h-4 w-4" />
                                Create Course
                            </button>
                            <button className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                <Users className="h-4 w-4" />
                                View Students
                            </button>
                            <button className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                <TrendingUp className="h-4 w-4" />
                                View Analytics
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
