import { createClient } from "@/lib/supabase/server";
import ArchitectureCanvas from "@/components/ArchitectureCanvas";

interface Props {
  params: Promise<{ id: string }>;
}

const defaultNodes = [
  { id: "fe", position: { x: 250, y: 50 }, data: { label: "Frontend (Next.js)", type: "frontend", description: "UI Codebase" } },
  { id: "api", position: { x: 250, y: 200 }, data: { label: "API Gateway", type: "backend", description: "Main routing handler" } },
  { id: "db", position: { x: 100, y: 400 }, data: { label: "PostgreSQL", type: "database", description: "Primary Data" } },
  { id: "auth", position: { x: 400, y: 400 }, data: { label: "Auth Provider", type: "external", description: "Supabase Auth" } },
];

const defaultEdges = [
  { id: "e-fe-api", source: "fe", target: "api", label: "REST", animated: true },
  { id: "e-api-db", source: "api", target: "db", label: "pg module" },
  { id: "e-api-auth", source: "api", target: "auth", label: "verify JWT" },
];

export default async function ArchitecturePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("blueprint_sections")
    .select("*")
    .eq("project_id", id);

  const arch = sections?.find((s) => s.section_type === "architecture")?.content as Record<string, unknown> | undefined;
  
  // If we have AI generated nodes/edges, use them. If not, fallback.
  // Wait, if it's the old format? Let's just fallback if nodes[0].position is missing.
  const rawNodes = arch?.nodes as any[];
  const rawEdges = (arch?.edges || arch?.connections) as any[];

  let nodes = defaultNodes;
  let edges = defaultEdges;

  if (rawNodes && rawNodes.length > 0 && typeof rawNodes[0].position === "object") {
    nodes = rawNodes;
  }
  if (rawEdges && rawEdges.length > 0) {
    edges = rawEdges.map(e => ({
      id: e.id || `e-${e.source || e.from}-${e.target || e.to}`,
      source: e.source || e.from,
      target: e.target || e.to,
      label: e.label,
      animated: e.animated || false
    }));
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Architecture Matrix</h2>
          <p className="text-on-surface-variant text-sm mt-1">Interactive system topology — drag nodes and sync changes</p>
        </div>
      </div>

      <div className="flex-1 relative">
         <ArchitectureCanvas initialNodes={nodes} initialEdges={edges} />
      </div>
    </div>
  );
}
