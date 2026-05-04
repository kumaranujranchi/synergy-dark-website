"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { format } from "date-fns";
import { Mail, Phone, ExternalLink, User, Calendar, Briefcase } from "lucide-react";

export default function ApplicationsPage() {
  const applications = useQuery(api.jobs.listApplications);
  const jobs = useQuery(api.jobs.listJobs);

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
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      app.status === 'hired' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {app.status}
                    </span>
                    <div className="flex items-center text-xs text-slate-400 mt-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(app.appliedAt, "MMM dd, yyyy • p")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">{app.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">{app.phone}</span>
                  </div>
                  {app.portfolioUrl && (
                    <div className="flex items-center space-x-3 text-slate-600">
                      <ExternalLink className="w-4 h-4 text-orange-500" />
                      <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 hover:underline">
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
                  <div className="space-y-4">
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
