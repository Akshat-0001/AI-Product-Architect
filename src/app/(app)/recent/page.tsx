import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function RecentProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Architect";

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user?.id)
    .order("updated_at", { ascending: false })
    .limit(10); // Show top 10 most recent

  return (
    <section className="px-10 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
            Recent Projects
          </h2>
          <p className="text-on-surface-variant text-lg">
            Jump back into your recent workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => {
            const statusColors: Record<string, string> = {
              in_progress: "bg-primary/10 text-primary",
              review_required: "bg-tertiary/10 text-tertiary",
              archived: "bg-on-surface-variant/20 text-on-surface-variant",
              completed: "bg-primary/10 text-primary",
            };
            const statusLabels: Record<string, string> = {
              in_progress: "In Progress",
              review_required: "Review Required",
              archived: "Archived",
              completed: "Completed",
            };
            return (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group bg-surface-container-low rounded-2xl overflow-hidden hover:bg-surface-container transition-all duration-300 flex flex-col h-64 relative"
              >
                <div className="absolute top-4 right-4 z-10">
                  <span className={`${statusColors[project.status] || statusColors.in_progress} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                    {statusLabels[project.status] || "In Progress"}
                  </span>
                </div>
                <div className="h-32 w-full overflow-hidden bg-gradient-to-br from-primary-container/10 to-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-primary/20" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-1">{project.name}</h3>
                    <div className="flex gap-2 mb-3">
                      {project.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-medium text-on-tertiary-container bg-tertiary-container/30 px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 rounded-full border-2 border-surface-container-low bg-slate-700 flex items-center justify-center text-[8px] font-bold">
                      {firstName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
