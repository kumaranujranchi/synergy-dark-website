"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Mail, Download } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function SubscribersPage() {
  const subscribers = useQuery(api.subscribers.listSubscribers);

  if (subscribers === undefined) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading subscribers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Email Subscribers</h1>
          <p className="text-slate-500">View and export your newsletter audience.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email Address</TableHead>
              <TableHead className="text-right">Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((sub) => (
              <TableRow key={sub._id}>
                <TableCell className="font-medium text-slate-900">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-slate-400" />
                    {sub.email}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm text-slate-500">
                  {new Date(sub._creationTime).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {subscribers.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-12 text-slate-400 italic">
                  No subscribers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
