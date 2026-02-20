"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ChangePasswordForm } from "@/components/profile/change-password-form";

export default function ProfilePage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading title="Profile" description="Manage your account settings and preferences." />
            </div>
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <ProfileInfo />
                </div>
                <div className="space-y-6">
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}
