"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Image as ImageIcon, UploadCloud, X } from "lucide-react";
import Link from "next/link";

export default function NewCaseStudyPage() {
  const router = useRouter();
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const addCaseStudy = useMutation(api.caseStudies.addCaseStudy);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    client: "",
    category: "",
    description: "",
    imageUrl: "",
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
      const postUrl = await generateUploadUrl();
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
      
      if (selectedFile) {
        const storageId = await handleUpload();
        if (!storageId) {
          setLoading(false);
          return;
        }
        finalImageUrl = storageId;
      }

      if (!finalImageUrl) {
        alert("Please upload an image.");
        setLoading(false);
        return;
      }

      await addCaseStudy({
        ...formData,
        imageUrl: finalImageUrl,
      });
      router.push("/dashboard/case-studies");
    } catch (error) {
      console.error(error);
      alert("Failed to add case study.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/case-studies" 
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Case Studies
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Add New Case Study</h1>
          <p className="text-slate-500 text-sm">Create a detailed success story for your portfolio.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
              Featured Image
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-video rounded-xl border-2 border-dashed transition-all cursor-pointer group
                ${imagePreview ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-400 hover:bg-slate-50'}`}
            >
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-medium flex items-center">
                      <UploadCloud className="w-5 h-5 mr-2" /> Change Image
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-4 py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-100 transition-all">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 font-bold">Click to upload image</p>
                    <p className="text-slate-500 text-sm mt-1">PNG, JPG or WebP (Recommended: 1200x800px)</p>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Case Study Title
              </label>
              <input
                required
                type="text"
                placeholder="e.g. 300% Growth in Organic Traffic"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Client Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Nexa Health"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.client}
                onChange={(e) => setFormData({...formData, client: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Category
              </label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select Category</option>
                <option value="SEO">Search Engine Optimization</option>
                <option value="Branding">Branding & Identity</option>
                <option value="Web Development">Web Development</option>
                <option value="Social Media">Social Media Marketing</option>
                <option value="Performance">Performance Marketing</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
              Summary / Description
            </label>
            <textarea
              required
              rows={5}
              placeholder="Briefly describe the challenge, solution and results achieved..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={loading || uploading}
              type="submit"
              className="flex items-center px-8 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50 shadow-lg shadow-orange-200"
            >
              {loading || uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {uploading ? 'Uploading Image...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Publish Case Study
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
