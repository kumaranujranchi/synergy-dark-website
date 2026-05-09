"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, Image as ImageIcon, UploadCloud, Globe } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const content = useQuery(api.content.getById, { id: id as any });
  const updateContent = useMutation(api.content.updateContent);
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const generateFileUrl = useMutation(api.upload.generateFileUrl);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    type: "blog",
    body: "",
    imageUrl: "",
    imageAltText: "",
    metaTitle: "",
    metaDescription: "",
    isPublished: true,
    author: "Admin",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  // Pre-fill form when content loads
  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || "",
        slug: content.slug || "",
        type: content.type || "blog",
        body: content.body || "",
        imageUrl: content.imageUrl || "",
        imageAltText: content.imageAltText || "",
        metaTitle: content.metaTitle || "",
        metaDescription: content.metaDescription || "",
        isPublished: content.isPublished ?? true,
        author: content.author || "Admin",
      });
      if (content.imageUrl) {
        setPreviewUrl(content.imageUrl);
      }
    }
  }, [content]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadStatus("Saving...");

    try {
      let finalImageUrl = formData.imageUrl;

      if (selectedFile) {
        setUploadStatus("Uploading image...");
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });
        const { storageId } = await result.json();
        const generatedUrl = await generateFileUrl({ storageId });
        finalImageUrl = generatedUrl || "";
      }

      setUploadStatus("Updating content...");
      await updateContent({
        id: id as any,
        ...formData,
        imageUrl: finalImageUrl,
      });

      router.push("/dashboard/content");
    } catch (error) {
      alert("Error updating content: " + error);
      setIsSubmitting(false);
      setUploadStatus("");
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'align': [] }],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (content === undefined) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading article...</div>;
  }

  if (content === null) {
    return <div className="flex items-center justify-center h-64 text-red-500">Article not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/content" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to list
        </Link>
        <div className="flex space-x-3">
          <button
            onClick={() => setFormData({...formData, isPublished: false})}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? uploadStatus : "Update Article"}
          </button>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-sm text-orange-700 font-medium">
        ✏️ Editing: <span className="font-bold">{content.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Article Details</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({...formData, title, metaTitle: title});
                }}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-lg font-medium"
                placeholder="Enter a catchy title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Content <span className="text-red-500">*</span></label>

              <style dangerouslySetInnerHTML={{__html: `
                .quill-custom-container .ql-toolbar {
                  position: sticky;
                  top: 0;
                  z-index: 50;
                  background-color: white;
                  border-top-left-radius: 0.5rem;
                  border-top-right-radius: 0.5rem;
                }
                .quill-custom-container .ql-container {
                  resize: vertical;
                  overflow-y: auto;
                  min-height: 400px;
                  border-bottom-left-radius: 0.5rem;
                  border-bottom-right-radius: 0.5rem;
                }
                .quill-custom-container .ql-editor {
                  min-height: 400px;
                }
              `}} />

              <div className="rounded-lg overflow-hidden border border-slate-200 quill-custom-container relative">
                <ReactQuill
                  theme="snow"
                  value={formData.body}
                  onChange={(body) => setFormData({...formData, body})}
                  modules={modules}
                  className="bg-white"
                  placeholder="Write your amazing article here..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">

          {/* Article Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Settings</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Article Type</label>
              <div className="flex space-x-3">
                {["blog", "news"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({...formData, type})}
                    className={`flex-1 py-2 px-3 text-sm rounded-md border transition-all capitalize font-medium ${
                      formData.type === type
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">URL Slug</label>
              <div className="flex items-center text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                <span className="mr-1 text-sm">/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="bg-transparent outline-none flex-1 text-slate-700 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Author Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-slate-700"
                placeholder="Enter author's name..."
                required
              />
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-slate-500" />
              Thumbnail Image
            </h2>

            <div>
              <div className="relative group cursor-pointer">
                {previewUrl ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium flex items-center">
                        <UploadCloud className="w-4 h-4 mr-2" /> Change Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-colors">
                    <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                    <span className="text-sm font-medium">Click to upload thumbnail</span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Max 5MB)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Image Alt Text</label>
              <input
                type="text"
                value={formData.imageAltText}
                onChange={(e) => setFormData({...formData, imageAltText: e.target.value})}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Describe the image for accessibility..."
              />
            </div>
          </div>

          {/* SEO Options */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-slate-500" />
              SEO Options
            </h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                Meta Title
                <span className={`text-xs ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>
                  {formData.metaTitle.length}/60
                </span>
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="SEO optimized title..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                Meta Description
                <span className={`text-xs ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
                  {formData.metaDescription.length}/160
                </span>
              </label>
              <textarea
                rows={4}
                value={formData.metaDescription}
                onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Write a compelling meta description..."
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
