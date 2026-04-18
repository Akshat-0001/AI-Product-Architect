import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectOverviewPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) return notFound();

  const { data: sections } = await supabase
    .from("blueprint_sections")
    .select("*")
    .eq("project_id", id);

  const overview = sections?.find((s) => s.section_type === "overview")?.content as Record<string, unknown> | undefined;

  const techStack = (overview?.techStack as string[]) || ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"];
  const metrics = (overview?.metrics as Record<string, number>) || {
    estimatedLinesOfCode: 12400,
    microservices: 4,
    databaseTables: 8,
    apiEndpoints: 24,
  };

  return (
    <div className="p-8">
      {/* Project Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 text-tertiary mb-3">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">AI-Generated Blueprint</span>
        </div>
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">{project.name}</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          {(overview?.description as string) || project.description || project.idea_text || "AI-generated product blueprint"}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Lines of Code", value: metrics.estimatedLinesOfCode?.toLocaleString(), icon: "code" },
          { label: "Microservices", value: metrics.microservices, icon: "hub" },
          { label: "Database Tables", value: metrics.databaseTables, icon: "database" },
          { label: "API Endpoints", value: metrics.apiEndpoints, icon: "api" },
        ].map((m) => (
          <div key={m.label} className="glass-panel ghost-border rounded-xl p-5">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <span className="material-symbols-outlined text-primary text-sm">{m.icon}</span>
              <span className="text-xs uppercase tracking-wider">{m.label}</span>
            </div>
            <p className="text-3xl font-bold text-on-surface">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Purpose */}
        <div className="lg:col-span-2 glass-panel ghost-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Project Purpose</h3>
          <p className="text-on-surface leading-relaxed">
            {(overview?.purpose as string) || project.idea_text || "This blueprint provides a comprehensive technical specification for your product."}
          </p>

          {/* Key Features */}
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mt-8 mb-4">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {((overview?.keyFeatures as string[]) || ["User Authentication", "Data Management", "API Layer", "Real-time Updates"]).map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-on-surface text-sm">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-panel ghost-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Tech Stack</h3>
          <div className="space-y-3">
            {techStack.map((tech: string) => (
              <div key={tech} className="flex items-center gap-3 bg-surface-container-highest/30 rounded-xl px-4 py-3">
                <span className="material-symbols-outlined text-primary text-lg">deployed_code</span>
                <span className="text-on-surface text-sm font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mt-8 glass-panel ghost-border rounded-2xl p-6">
        <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Activity Feed</h3>
        <div className="space-y-4">
          {[
            { icon: "check_circle", text: "Blueprint generated successfully", time: new Date(project.created_at).toLocaleString(), color: "text-primary" },
            { icon: "architecture", text: "Architecture matrix compiled", time: new Date(project.created_at).toLocaleString(), color: "text-tertiary" },
            { icon: "database", text: "Database schema designed", time: new Date(project.created_at).toLocaleString(), color: "text-primary" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className={`material-symbols-outlined ${item.color} text-lg`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              <span className="text-on-surface text-sm flex-1">{item.text}</span>
              <span className="text-on-surface-variant text-xs">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
