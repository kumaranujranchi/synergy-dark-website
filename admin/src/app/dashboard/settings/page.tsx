"use client";

import { Shield, Users, Lock, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500">Manage access control and system configurations.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-slate-900">Role-Based Access Control (RBAC)</h2>
        </div>
        
        <div className="space-y-6">
          <p className="text-slate-600">
            Access is currently managed via **Clerk**. To assign roles to your team members, follow these steps:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center text-slate-900 font-bold mb-2">
                <Users className="w-4 h-4 mr-2 text-blue-500" /> Admin
              </div>
              <p className="text-xs text-slate-500">Full access to all management features, including deleting content and managing leads.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center text-slate-900 font-bold mb-2">
                <Lock className="w-4 h-4 mr-2 text-green-500" /> Editor
              </div>
              <p className="text-xs text-slate-500">Can create and edit blogs/projects, but cannot delete or access lead contact details.</p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-start">
            <Key className="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-orange-800">Developer Note</p>
              <p className="text-xs text-orange-700 mt-1">
                To enforce these roles in the backend, use the Clerk Dashboard to add `{"role": "admin"}` to the user's **Public Metadata**. The system is ready to read these values.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Environment Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm py-2 border-b border-slate-100">
            <span className="text-slate-500">Backend Provider</span>
            <span className="text-slate-900 font-medium">Convex (Serverless)</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b border-slate-100">
            <span className="text-slate-500">Auth Provider</span>
            <span className="text-slate-900 font-medium">Clerk</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="text-slate-500">Frontend Type</span>
            <span className="text-slate-900 font-medium">Static HTML (SEO Optimized)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
