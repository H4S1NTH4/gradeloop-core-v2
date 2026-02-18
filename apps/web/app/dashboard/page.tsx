import React from "react";
import { Button } from "@/components/ui/button";
import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview and quick stats
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">New Report</Button>
        </div>
      </header>

      <DashboardGrid />
    </div>
  );
}
