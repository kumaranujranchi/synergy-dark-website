"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Plus, Trash2, ExternalLink, FolderKanban } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ProjectsPage() {
  const projects = useQuery(api.projects.listProjects);
  const deleteProject = useMutation(api.projects.deleteProject);

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject({ id });
    }
  };

  if (projects === undefined) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-heading">Projects Portfolio</h1>
          <p className="text-slate-500">Showcase your best work to potential clients.</p>
        </div>
        <Link 
          href="/dashboard/projects/new"
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
            <div className="aspect-video bg-slate-100 relative">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-300">
                  <FolderKanban className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(project._id)}
                  className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2 gap-2">
                <div>
                  <h3 className="font-bold text-slate-900">{project.title}</h3>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-[10px]">{project.category}</Badge>
                    <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600">
                      Page: {project.displayPage === 'shopify' ? 'Shopify' : project.displayPage === 'projects' ? 'Projects' : 'Both'}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.description}</p>
              {project.projectUrl && (
                <a 
                  href={project.projectUrl} 
                  target="_blank" 
                  className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  View Project <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
            <FolderKanban className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No projects added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
