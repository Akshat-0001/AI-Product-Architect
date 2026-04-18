import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Architect";

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <section className="px-10 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
              {greeting}, {firstName}
            </h2>
            <p className="text-on-surface-variant text-lg">
              Architecting the future, one node at a time.
            </p>
          </div>
          {/* Filter Bar */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
            <button className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-on-primary shadow-lg shadow-primary/10">All</button>
            <button className="px-6 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Recent</button>
            <button className="px-6 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Shared</button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Project CTA Card */}
          <Link href="/new" className="group relative flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:bg-surface-container transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest group-hover:bg-primary-container flex items-center justify-center transition-all mb-4">
              <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container text-3xl">add</span>
            </div>
            <span className="text-lg font-semibold text-on-surface">New Project</span>
            <span className="text-sm text-on-surface-variant mt-1">Start from a clean blueprint</span>
          </Link>

          {/* Project Cards */}
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

          {/* AI Insights Card */}
          <div className="lg:col-span-2 group bg-gradient-to-br from-surface-container-low to-surface-container-highest rounded-2xl p-8 flex items-center justify-between relative overflow-hidden border border-outline-variant/10">
            <div className="relative z-10 max-w-md">
              <div className="flex items-center gap-2 text-tertiary mb-3">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">AI Insights</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-4 leading-tight">
                Start a new project to see AI-powered architecture recommendations.
              </h3>
              <Link href="/new" className="bg-primary hover:bg-primary-fixed-dim text-on-primary px-6 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 w-fit">
                Create Project
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="hidden md:block relative w-48 h-48">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <span className="material-symbols-outlined text-[120px] text-primary/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ fontVariationSettings: "'FILL' 1" }}>query_stats</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <Link href="/new" className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-50">
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </section>
  );
}
