"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Plus, MapPin, Briefcase, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function JobsPage() {
  const jobs = useQuery(api.jobs.listJobs);
  const toggleStatus = useMutation(api.jobs.toggleJobStatus);

  const handleToggle = async (id: any, currentStatus: boolean) => {
    await toggleStatus({ id, isActive: !currentStatus });
  };

  if (jobs === undefined) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading jobs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Job Postings</h1>
          <p className="text-slate-500">Manage your agency's career opportunities.</p>
        </div>
        <Link 
          href="/dashboard/jobs/new"
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Location/Type</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>
                  <div className="font-bold text-slate-900">{job.title}</div>
                  <div className="text-xs text-slate-500">{job.department}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-xs text-slate-600">
                      <MapPin className="w-3 h-3 mr-1" /> {job.location}
                    </div>
                    <div className="flex items-center text-xs text-slate-600">
                      <Clock className="w-3 h-3 mr-1" /> {job.type}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {new Date(job.postedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={job.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                    {job.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button 
                    onClick={() => handleToggle(job._id, job.isActive)}
                    className={`p-2 transition-colors ${job.isActive ? "text-green-600 hover:text-green-700" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {job.isActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">
                  No job postings yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
