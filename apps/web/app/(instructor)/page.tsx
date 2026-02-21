// This is a layout-only route group. Redirect to dashboard.
import { redirect } from "next/navigation";

export default function InstructorRootPage() {
    redirect("/instructor/dashboard");
}
