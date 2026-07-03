"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { format } from "date-fns";
import { Mail, Phone, ExternalLink, User, Calendar, Briefcase, FileText, Check, Trash2 } from "lucide-react";

export default function ApplicationsPage() {
  const applications = useQuery(api.jobs.listApplications, {});
  const jobs = useQuery(api.jobs.listJobs);

  const updateStatus = useMutation(api.jobs.updateApplicationStatus);
  const updateNotes = useMutation(api.jobs.updateApplicationNotes);
  const deleteApp = useMutation(api.jobs.deleteApplication);

  const [savingStatus, setSavingStatus] = useState<Record<string, "saving" | "saved" | null>>({});

  if (!applications || !jobs) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const getJobTitle = (jobId: string) => {
    return jobs.find((j: any) => j._id === jobId)?.title || "Unknown Job";
  };

  const handleStatusChange = async (appId: any, newStatus: string) => {
    try {
      await updateStatus({ id: appId, status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async (appId: any, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}'s application?`)) {
      return;
    }
    try {
      await deleteApp({ id: appId });
    } catch (err) {
      console.error("Error deleting application:", err);
      alert("Failed to delete application. Please try again.");
    }
  };

  const handleNotesBlur = async (appId: any, currentNotes: string, newNotes: string) => {
    if (currentNotes === newNotes) return;

    setSavingStatus((prev) => ({ ...prev, [appId]: "saving" }));
    try {
      await updateNotes({ id: appId, notes: newNotes });
      setSavingStatus((prev) => ({ ...prev, [appId]: "saved" }));
      setTimeout(() => {
        setSavingStatus((prev) => ({ ...prev, [appId]: null }));
      }, 2000);
    } catch (err) {
      console.error("Error updating notes:", err);
      setSavingStatus((prev) => ({ ...prev, [appId]: null }));
      alert("Failed to save notes. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-heading">Job Applications</h1>
        <p className="text-slate-500">Review candidates who applied via the website.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {applications.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-dashed border-slate-200 text-center">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No applications received yet.</p>
          </div>
        ) : (
          applications.map((app: any) => (
            <div key={app._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-orange-200 transition-colors">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{app.name}</h3>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <Briefcase className="w-4 h-4 mr-1 text-orange-500" />
                        Applied for: <span className="font-semibold text-slate-700 ml-1">{getJobTitle(app.jobId)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                          app.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100" :
                          app.status === "hired" ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" :
                          app.status === "interviewing" ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" :
                          app.status === "reviewed" ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" :
                          app.status === "rejected" ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" :
                          "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <option value="pending" className="bg-white text-slate-700">Pending</option>
                        <option value="reviewed" className="bg-white text-slate-700">Reviewed</option>
                        <option value="interviewing" className="bg-white text-slate-700">Interviewing</option>
                        <option value="hired" className="bg-white text-slate-700">Hired</option>
                        <option value="rejected" className="bg-white text-slate-700">Rejected</option>
                      </select>

                      <button
                        onClick={() => handleDelete(app._id, app.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center text-xs text-slate-400 mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(app.appliedAt, "MMM dd, yyyy • p")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 font-medium">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="text-sm truncate">{app.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="text-sm truncate">{app.phone}</span>
                  </div>
                  {app.resumeUrl && (
                    <div className="flex items-center space-x-3 text-slate-600">
                      <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                      <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 hover:underline flex items-center gap-1 font-semibold">
                        View Resume <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {app.portfolioUrl && (
                    <div className="flex items-center space-x-3 text-slate-600">
                      <ExternalLink className="w-4 h-4 text-orange-500 shrink-0" />
                      <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                        View Portfolio
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message / Cover Letter</h4>
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{app.message || "No message provided."}</p>
                </div>

                {app.answers && app.answers.length > 0 && (
                  <div className="space-y-4 mb-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Custom Question Answers</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {app.answers.map((ans: any, idx: number) => (
                        <div key={idx} className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                          <p className="text-xs font-bold text-orange-800 mb-1">{ans.question}</p>
                          <p className="text-sm text-slate-700">{ans.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes Section */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                      <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Admin Notes
                    </h4>
                    {savingStatus[app._id] === "saving" && (
                      <span className="text-xs text-orange-500 font-medium animate-pulse">Saving...</span>
                    )}
                    {savingStatus[app._id] === "saved" && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Saved
                      </span>
                    )}
                  </div>
                  <textarea
                    defaultValue={app.notes || ""}
                    onBlur={(e) => handleNotesBlur(app._id, app.notes || "", e.target.value)}
                    placeholder="Add feedback, notes, or next steps for this candidate..."
                    className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all resize-y min-h-[80px]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 text-right">
                    Notes save automatically when you click outside the text area.
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
