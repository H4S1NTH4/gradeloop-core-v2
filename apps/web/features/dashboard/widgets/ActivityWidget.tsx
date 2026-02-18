import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ActivityWidget() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across your account</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    <li className="text-sm text-muted-foreground">Logged in just now</li>
                    <li className="text-sm text-muted-foreground">Dashboard updated to dynamic grid</li>
                </ul>
            </CardContent>
            <CardFooter>
                <Button variant="ghost" size="sm">View all activity</Button>
            </CardFooter>
        </Card>
    );
}
