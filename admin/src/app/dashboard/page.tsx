import { 
  Users, 
  Mail, 
  FileText, 
  Briefcase 
} from "lucide-react";

export default function DashboardHome() {
  const stats = [
    { name: "Total Leads", value: "24", icon: Users, color: "bg-orange-500" },
    { name: "Subscribers", value: "156", icon: Mail, color: "bg-blue-500" },
    { name: "Blog Posts", value: "12", icon: FileText, color: "bg-green-500" },
    { name: "Job Openings", value: "3", icon: Briefcase, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-reveal-anim">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back! Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-slate-900 font-medium">New lead received from John Doe</p>
                  <p className="text-slate-500 text-xs">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">System Status</h2>
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
