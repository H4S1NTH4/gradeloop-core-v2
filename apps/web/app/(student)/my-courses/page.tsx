"use client";

import { BookOpen, Clock, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual API calls
const mockCourses = [
  {
    id: "1",
    name: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Smith",
    progress: 75,
    status: "active",
  },
  {
    id: "2",
    name: "Data Structures",
    code: "CS201",
    instructor: "Dr. Johnson",
    progress: 45,
    status: "active",
  },
  {
    id: "3",
    name: "Algorithms",
    code: "CS301",
    instructor: "Dr. Williams",
    progress: 30,
    status: "active",
  },
  {
    id: "4",
    name: "Database Systems",
    code: "CS305",
    instructor: "Dr. Brown",
    progress: 100,
    status: "completed",
  },
  {
    id: "5",
    name: "Operating Systems",
    code: "CS310",
    instructor: "Dr. Davis",
    progress: 0,
    status: "pending",
  },
];

export default function MyCoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">
          View and access your enrolled courses
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course) => (
          <Card key={course.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <Badge
                  variant={
                    course.status === "completed"
                      ? "default"
                      : course.status === "active"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {course.status === "completed" && (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  )}
                  {course.status === "active" && (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  {course.status}
                </Badge>
              </div>
              <CardTitle className="mt-3 text-lg">{course.name}</CardTitle>
              <CardDescription>
                {course.code} • {course.instructor}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {course.status !== "pending" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}
              {course.status === "pending" ? (
                <Button className="w-full mt-4" variant="outline" disabled>
                  Enrollment Pending
                </Button>
              ) : (
                <Button className="w-full mt-4">
                  {course.status === "completed"
                    ? "Review Course"
                    : "Continue Learning"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {mockCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No courses yet</h3>
          <p className="text-muted-foreground">
            Enroll in courses to see them here
          </p>
        </div>
      )}
    </div>
  );
}
