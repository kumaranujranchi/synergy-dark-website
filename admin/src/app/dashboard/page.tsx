"use client";

import { 
  Users, 
  Mail, 
  FileText, 
  Briefcase,
  FolderKanban
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function DashboardHome() {
  const leads = useQuery(api.leads.listLeads);
  const subscribers = useQuery(api.subscribers.listSubscribers);
  const content = useQuery(api.content.listAll);
  const projects = useQuery(api.projects.listProjects);
  const applications = useQuery(api.jobs.listApplications, {});

  const stats = [
    { name: "Total Leads", value: leads?.length ?? "-", icon: Users, color: "bg-[#f05a28]" },
    { name: "Subscribers", value: subscribers?.length ?? "-", icon: Mail, color: "bg-blue-600" },
    { name: "Blog/News", value: content?.length ?? "-", icon: FileText, color: "bg-green-600" },
    { name: "Projects", value: projects?.length ?? "-", icon: FolderKanban, color: "bg-purple-600" },
    { name: "Applications", value: applications?.length ?? "-", icon: Briefcase, color: "bg-pink-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-reveal-anim font-heading">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back! Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4 font-heading">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-sm">
              <div className="w-2 h-2 bg-[#f05a28] rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="text-slate-900 font-medium">Dashboard connected to live database</p>
                <p className="text-slate-500 text-xs">Just now</p>
              </div>
            </div>
            {/* You can add a query for recent leads or content here later */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4 font-heading">System Status</h2>
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
            <span className="text-sm text-green-700 font-medium">Convex Backend</span>
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg mt-3">
            <span className="text-sm text-green-700 font-medium">Clerk Auth</span>
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
