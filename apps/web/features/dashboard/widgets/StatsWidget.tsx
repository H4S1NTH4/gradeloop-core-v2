import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsWidget() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Courses</CardTitle>
                <CardDescription>Courses you're currently teaching or enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">12</div>
            </CardContent>
        </Card>
    );
}
