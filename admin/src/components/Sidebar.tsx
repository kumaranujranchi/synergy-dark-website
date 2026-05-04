"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  FileText, 
  Briefcase, 
  FolderKanban, 
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Mail },
  { name: "Content (Blog/News)", href: "/dashboard/content", icon: FileText },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Careers", href: "/dashboard/jobs", icon: Briefcase },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-orange-500">Synergy Admin</h2>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? "bg-orange-600 text-white" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-4 py-2">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm font-medium text-slate-300">Profile</span>
        </div>
      </div>
    </div>
  );
}
