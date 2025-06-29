"use client";
import { DashboardHeader } from "@/app/components/DashboardHeader";
import { Sidebar } from "@/app/components/Sidebar";


export default function DashboardAdmLayout({ children }) {
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
