import { PermissionGate } from "@/components/permission-gate";

export default function DashboardPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to the dashboard. If you see this content, the layout is working correctly.</p>

            <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900 space-y-2">
                <h2 className="text-lg font-semibold">Permission Gate Test</h2>
                <PermissionGate permission="manage_users">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded border border-green-200 dark:border-green-900">
                        ✅ You have 'manage_users' permission.
                    </div>
                </PermissionGate>
                <PermissionGate permission="manage_roles">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-900">
                        ✅ You have 'manage_roles' permission.
                    </div>
                </PermissionGate>
                <PermissionGate permission="non_existent_permission">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded border border-red-200 dark:border-red-900">
                        ❌ This should NOT be visible.
                    </div>
                </PermissionGate>
            </div>
        </div>
    );
}
