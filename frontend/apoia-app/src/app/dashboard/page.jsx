// src/app/dashboard/page.jsx
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardCards } from "../components/DashboardCards";
import { Sidebar } from '../components/SideBar';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <DashboardHeader />
        <DashboardCards />
      </div>
    </div>
  );
}
