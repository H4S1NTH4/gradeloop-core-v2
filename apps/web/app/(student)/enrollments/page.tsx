"use client";

import { useState } from "react";
import { GraduationCap, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - replace with actual API calls
const mockEnrollments = [
  {
    id: "1",
    courseName: "Introduction to Computer Science",
    courseCode: "CS101",
    requestDate: "2024-01-15",
    status: "approved",
    instructor: "Dr. Smith",
  },
  {
    id: "2",
    courseName: "Data Structures",
    courseCode: "CS201",
    requestDate: "2024-01-16",
    status: "approved",
    instructor: "Dr. Johnson",
  },
  {
    id: "3",
    courseName: "Algorithms",
    courseCode: "CS301",
    requestDate: "2024-01-17",
    status: "approved",
    instructor: "Dr. Williams",
  },
  {
    id: "4",
    courseName: "Operating Systems",
    courseCode: "CS310",
    requestDate: "2024-01-20",
    status: "pending",
    instructor: "Dr. Davis",
  },
  {
    id: "5",
    courseName: "Machine Learning",
    courseCode: "CS401",
    requestDate: "2024-01-18",
    status: "rejected",
    instructor: "Dr. Brown",
    reason: "Prerequisites not met",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-amber-600" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return null;
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "approved":
      return "default" as const;
    case "pending":
      return "secondary" as const;
    case "rejected":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
};

export default function EnrollmentsPage() {
  const [enrollments] = useState(mockEnrollments);

  const stats = {
    total: enrollments.length,
    approved: enrollments.filter((e) => e.status === "approved").length,
    pending: enrollments.filter((e) => e.status === "pending").length,
    rejected: enrollments.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enrollments</h1>
        <p className="text-muted-foreground">
          Track your course enrollment requests
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrollment History</CardTitle>
          <CardDescription>All your course enrollment requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{enrollment.courseName}</div>
                      <div className="text-sm text-muted-foreground">
                        {enrollment.courseCode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{enrollment.instructor}</TableCell>
                  <TableCell>{enrollment.requestDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(enrollment.status)}
                      className="gap-1"
                    >
                      {getStatusIcon(enrollment.status)}
                      {enrollment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {enrollment.status === "rejected" && enrollment.reason && (
                      <Button
                        variant="link"
                        className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                      >
                        View Reason
                      </Button>
                    )}
                    {enrollment.status === "pending" && (
                      <Button
                        variant="link"
                        className="h-auto p-0 text-sm text-amber-600 hover:text-amber-700"
                      >
                        Cancel Request
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
