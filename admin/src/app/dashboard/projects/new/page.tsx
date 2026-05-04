"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Image as ImageIcon, UploadCloud, X } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const addProject = useMutation(api.projects.addProject);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    client: "",
    imageUrl: "",
    projectUrl: "",
    order: 0,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return null;
    
    setUploading(true);
    try {
      // 1. Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      
      // 2. POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      
      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let finalImageUrl = formData.imageUrl;
      
      // If a file was selected, upload it first
      if (selectedFile) {
        const storageId = await handleUpload();
        if (!storageId) {
          setLoading(false);
          return;
        }
        finalImageUrl = storageId;
      }

      if (!finalImageUrl) {
        alert("Please upload an image or provide a URL.");
        setLoading(false);
        return;
      }

      await addProject({
        ...formData,
        imageUrl: finalImageUrl,
        order: Number(formData.order),
      });
      router.push("/dashboard/projects");
    } catch (error) {
      console.error(error);
      alert("Failed to add project. Please check if all required fields are filled.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/projects" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading">Add New Project</h1>
            <p className="text-slate-500">Add a new showcase to your portfolio.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Title*</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Synergy SaaS Platform"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description*</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Describe the project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category*</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="SaaS">SaaS</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Branding">Branding</option>
                  <option value="Web Design">Web Design</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client (Optional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Client name"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 mb-2 font-heading">Project Assets</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail Image*</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all overflow-hidden relative group"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-slate-400 mt-2">Click to change image</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-xs text-slate-500">Click to upload thumbnail</p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Or Image URL</label>
              <input
                type="url"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-xs"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Link (Optional)</label>
              <input
                type="url"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-xs"
                placeholder="https://project-demo.com"
                value={formData.projectUrl}
                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              />
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:bg-slate-300"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading || uploading ? "Processing..." : "Save Project"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
