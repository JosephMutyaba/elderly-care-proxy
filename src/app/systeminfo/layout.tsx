import AdminDashboardPage from "@/app/dashboard/layout";
import React from "react";

export default function SystemLayout({children}: {children: React.ReactNode}) {
    return (
        <AdminDashboardPage>
            {children}
        </AdminDashboardPage>
    );
}
