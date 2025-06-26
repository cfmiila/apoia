// src/app/dashboard-ong/layout.jsx
"use client";
import { Sidebar } from "@/app/components/Sidebar";
import { DashboardHeader } from "@/app/components/DashboardHeader";

export default function DashboardOngLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}
