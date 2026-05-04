"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Globe, Lock } from "lucide-react";
import Link from "next/link";

export default function NewContentPage() {
  const router = useRouter();
  const addContent = useMutation(api.content.addContent);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    type: "blog",
    body: "",
    isPublished: true,
    author: "Admin",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addContent({
        ...formData,
        imageUrl: "", // Placeholder for now
      });
      router.push("/dashboard/content");
    } catch (error) {
      alert("Error saving content: " + error);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/content" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to list
        </Link>
        <div className="flex space-x-3">
          <button 
            onClick={() => setFormData({...formData, isPublished: false})}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Save Draft
          </button>
          <button 
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Publish Now
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Article Type</label>
            <div className="flex space-x-4">
              {["blog", "news"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({...formData, type})}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all capitalize ${
                    formData.type === type 
                    ? "border-orange-500 bg-orange-50 text-orange-700" 
                    : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({...formData, title, slug: generateSlug(title)});
              }}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-xl font-bold"
              placeholder="Enter a catchy title..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">URL Slug</label>
            <div className="flex items-center text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
              <span className="mr-1">/</span>
              <input 
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="bg-transparent outline-none flex-1 text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Content (Markdown/HTML)</label>
            <textarea 
              rows={15}
              value={formData.body}
              onChange={(e) => setFormData({...formData, body: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-mono"
              placeholder="Write your article content here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
