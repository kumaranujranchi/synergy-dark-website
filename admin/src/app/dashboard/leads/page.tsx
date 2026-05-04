"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
export default function LeadsPage() {
  const leads = useQuery(api.leads.listLeads);
  const updateStatus = useMutation(api.leads.updateLeadStatus);

  const handleStatusChange = async (id: any, status: string) => {
    await updateStatus({ id, status });
  };

  if (leads === undefined) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Leads Management</h1>
        <Badge variant="outline" className="bg-white text-slate-600">
          Total: {leads.length}
        </Badge>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="text-sm text-slate-500">
                  {new Date(lead._creationTime).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium text-slate-900">{lead.name}</TableCell>
                <TableCell>
                  <div className="text-sm text-slate-600">{lead.email}</div>
                  {lead.phone && <div className="text-xs text-slate-400">{lead.phone}</div>}
                </TableCell>
                <TableCell className="max-w-xs truncate">{lead.subject || "No Subject"}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      lead.status === "new" ? "bg-orange-100 text-orange-700 hover:bg-orange-100" :
                      lead.status === "contacted" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                      lead.status === "qualified" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                      "bg-slate-100 text-slate-700 hover:bg-slate-100"
                    }
                  >
                    {lead.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <select 
                    className="block w-full px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white text-slate-700"
                    defaultValue={lead.status} 
                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400 italic">
                  No leads found yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
