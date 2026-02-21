import { Sidebar } from "@/components/sidebar";
import { DashboardTopbar } from "@/components/dashboard-topbar";
import { InstructorGuard } from "@/components/auth/instructor-guard";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-gray-100 dark:bg-neutral-900 overflow-hidden">
            <Sidebar role="instructor" />
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <DashboardTopbar />
                <main className="flex-1 overflow-auto bg-gray-100 dark:bg-neutral-900 p-4 md:p-6">
                    <div className="w-full h-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm overflow-hidden p-4 md:p-6">
                        <InstructorGuard>{children}</InstructorGuard>
                    </div>
                </main>
            </div>
        </div>
    );
}
