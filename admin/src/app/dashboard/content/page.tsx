"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { Plus, Edit, Trash2, Eye, CheckCircle, XCircle, X, Save, ChevronLeft, Image as ImageIcon, UploadCloud, Globe } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dynamically import ReactQuill and image resize module to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    if (typeof window !== "undefined") {
      (window as any).Quill = RQ.Quill;
      // @ts-ignore
      const { default: ImageResize } = await import("quill-image-resize-module-react");
      RQ.Quill.register("modules/imageResize", ImageResize);
    }
    return function ForwardedQuill(props: any) {
      return <RQ {...props} />;
    };
  },
  { ssr: false }
);

type ContentItem = {
  _id: any;
  title: string;
  slug: string;
  type: string;
  body: string;
  imageUrl?: string;
  imageAltText?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  author: string;
  publishedAt: number;
  tags?: string[];
};

export default function ContentPage() {
  const content = useQuery(api.content.listAll);
  const deleteContent = useMutation(api.content.deleteContent);
  const togglePublish = useMutation(api.content.togglePublish);
  const updateContent = useMutation(api.content.updateContent);
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const generateFileUrl = useMutation(api.upload.generateFileUrl);

  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleDelete = async (id: any) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteContent({ id });
      } catch (error) {
        console.error(error);
        alert("Failed to delete article.");
      }
    }
  };

  const handleTogglePublish = async (id: any, currentStatus: boolean) => {
    try {
      await togglePublish({ id, isPublished: !currentStatus });
    } catch (error) {
      console.error(error);
    }
  };

  const openEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      slug: item.slug || "",
      type: item.type || "blog",
      body: item.body || "",
      imageUrl: item.imageUrl || "",
      imageAltText: item.imageAltText || "",
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      isPublished: item.isPublished ?? true,
      author: item.author || "Admin",
    });
    setPreviewUrl(item.imageUrl || null);
    setSelectedFile(null);
  };

  const closeEdit = () => {
    setEditingItem(null);
    setFormData(null);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || !formData) return;
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
      setUploadStatus("Updating...");
      await updateContent({ id: editingItem._id, ...formData, imageUrl: finalImageUrl });
      closeEdit();
    } catch (error) {
      alert("Error updating: " + error);
    } finally {
      setIsSubmitting(false);
      setUploadStatus("");
    }
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
    imageResize: {
      parchment: {
        image: {
          attribute: ['width', 'height']
        }
      },
      modules: ['Resize', 'DisplaySize']
    }
  };

  if (content === undefined) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading content...</div>;
  }

  // ── EDIT PANEL ──────────────────────────────────────────────────────────────
  if (editingItem && formData) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={closeEdit} className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to list
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => { setFormData({...formData, isPublished: false}); }}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? uploadStatus : "Update Article"}
            </button>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-sm text-orange-700 font-medium">
          ✏️ Editing: <span className="font-bold">{editingItem.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Article Details</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value, metaTitle: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-lg font-medium"
                  placeholder="Enter a catchy title..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Content <span className="text-red-500">*</span></label>
                <style dangerouslySetInnerHTML={{__html: `
                  .quill-custom-container { height: 600px; resize: vertical; overflow-y: auto; min-height: 400px; }
                  .quill-custom-container .ql-toolbar { position: sticky; top: 0; z-index: 50; background-color: white; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-bottom: 1px solid #e2e8f0; }
                  .quill-custom-container .ql-container { min-height: 400px; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; border: none; }
                  .quill-custom-container .ql-editor { min-height: 400px; }
                `}} />
                <div className="rounded-lg border border-slate-200 quill-custom-container relative">
                  <ReactQuill
                    theme="snow"
                    value={formData.body}
                    onChange={(body: string) => setFormData({...formData, body})}
                    modules={modules}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Settings</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Article Type</label>
                <div className="flex space-x-3">
                  {["blog", "news"].map((type) => (
                    <button key={type} onClick={() => setFormData({...formData, type})}
                      className={`flex-1 py-2 px-3 text-sm rounded-md border capitalize font-medium transition-all ${formData.type === type ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">URL Slug</label>
                <div className="flex items-center text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  <span className="mr-1 text-sm">/</span>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="bg-transparent outline-none flex-1 text-slate-700 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Author Name</label>
                <input type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-orange-500 outline-none" />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-slate-500" /> Thumbnail Image
              </h2>
              <div className="relative group cursor-pointer">
                {previewUrl ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm flex items-center"><UploadCloud className="w-4 h-4 mr-2" /> Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100">
                    <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                    <span className="text-sm font-medium">Click to upload thumbnail</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Image Alt Text</label>
                <input type="text" value={formData.imageAltText} onChange={(e) => setFormData({...formData, imageAltText: e.target.value})}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-orange-500 outline-none" placeholder="Alt text..." />
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-slate-500" /> SEO Options
              </h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                  Meta Title <span className={`text-xs ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{formData.metaTitle.length}/60</span>
                </label>
                <input type="text" value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                  Meta Description <span className={`text-xs ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{formData.metaDescription.length}/160</span>
                </label>
                <textarea rows={4} value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-orange-500 outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-heading">Blog & News</h1>
          <p className="text-slate-500">Manage your website articles and news updates.</p>
        </div>
        <Link
          href="/dashboard/content/new"
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Article</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div className="font-medium text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-400">/{item.slug}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleTogglePublish(item._id, item.isPublished)}
                    className={`flex items-center px-2 py-1 rounded-full text-xs font-bold transition-colors ${
                      item.isPublished
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {item.isPublished ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Published</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Draft</>
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <a
                      href={item.type === 'blog' ? `/blog/${item.slug}` : `/news/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openEdit(item as ContentItem)}
                      className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {content.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">
                  No articles found. Start by creating one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
