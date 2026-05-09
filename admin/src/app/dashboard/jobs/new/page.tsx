"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Briefcase, Plus, Trash2, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();
  const postJob = useMutation(api.jobs.postJob);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "Marketing",
    location: "",
    type: "Full-time",
    description: "",
    salaryRange: "",
    isActive: true,
  });

  const [questions, setQuestions] = useState<{ question: string; required: boolean }[]>([]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", required: true }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postJob({
        ...formData,
        customQuestions: questions.length > 0 ? questions : undefined,
      });
      router.push("/dashboard/jobs");
    } catch (error) {
      console.error(error);
      alert("Failed to post job. Please fill all required fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/jobs" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading">Post New Job</h1>
            <p className="text-slate-500">Add a new career opportunity to your agency.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title*</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Senior Full Stack Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department*</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Marketing">Marketing</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Sales">Sales</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Ops">Operations</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location*</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Remote / New York, NY"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Description*</label>
              <textarea
                required
                rows={8}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Detail the roles, responsibilities, and requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Custom Questions Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-slate-900 font-heading">Custom Application Questions</h3>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Question
              </button>
            </div>
            
            <p className="text-sm text-slate-500">Add specific questions you want candidates to answer when they apply.</p>

            <div className="space-y-4 mt-4">
              {questions.map((q, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question {index + 1}</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="e.g. Do you have experience with React?"
                        value={q.question}
                        onChange={(e) => updateQuestion(index, "question", e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="mt-6 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`req-${index}`}
                      className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                      checked={q.required}
                      onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                    />
                    <label htmlFor={`req-${index}`} className="ml-2 text-sm text-slate-600">Mark as mandatory</label>
                  </div>
                </div>
              ))}
              {questions.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm italic">
                  No custom questions added.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 mb-2 font-heading">Job Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Type*</label>
              <select
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range (Optional)</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. $80k - $120k / year"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-slate-700">Set as Active</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? "bg-orange-600" : "bg-slate-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:bg-slate-300"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
