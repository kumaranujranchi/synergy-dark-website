"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ContentPage() {
  const content = useQuery(api.content.listAll);
  const deleteContent = useMutation(api.content.deleteContent);
  const togglePublish = useMutation(api.content.togglePublish);

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

  if (content === undefined) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading content...</div>;
  }

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
                    <Link
                      href={`/dashboard/content/edit/${item._id}`}
                      className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
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
