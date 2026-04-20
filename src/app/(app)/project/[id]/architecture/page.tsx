import { createClient } from "@/lib/supabase/server";
import ArchitectureCanvas from "@/components/ArchitectureCanvas";

interface Props {
  params: Promise<{ id: string }>;
}

const defaultSummary = "This project uses a modern headless architecture where a Next.js frontend communicates with a Go-based API Gateway. Data persists in a PostgreSQL database, while Redis provides a high-speed caching layer for performance.";

const defaultNodes = [
  { id: "dns", type: "architecture", position: { x: 50, y: 150 }, data: { label: "Cloudflare DNS", type: "dns", tech: "DNS", description: "Global traffic routing." } },
  { id: "firewall", type: "architecture", position: { x: 150, y: 150 }, data: { label: "WAF / Firewall", type: "firewall", tech: "WAF", description: "Security filter." } },
  { id: "gateway", type: "architecture", position: { x: 300, y: 150 }, data: { label: "API Gateway", type: "gateway", tech: "Caddy", description: "Request routing." } },
  { id: "web", type: "architecture", position: { x: 300, y: 0 }, data: { label: "Web Portal", type: "web", tech: "Next.js", description: "User frontend." } },
  { id: "server", type: "architecture", position: { x: 500, y: 150 }, data: { label: "Core API", type: "server", tech: "Golang", description: "Business logic." } },
  { id: "db", type: "architecture", position: { x: 700, y: 150 }, data: { label: "PostgreSQL", type: "database", tech: "Supabase", description: "Primary storage." } },
  { id: "cache", type: "architecture", position: { x: 700, y: 0 }, data: { label: "Redis Cache", type: "cache", tech: "Redis", description: "Fast read layer." } },
];

const defaultEdges = [
  { id: "e1", source: "dns", target: "firewall", label: "UDP/53" },
  { id: "e2", source: "firewall", target: "gateway", label: "HTTPS" },
  { id: "e3", source: "web", target: "gateway", label: "REST" },
  { id: "e4", source: "gateway", target: "server", label: "gRPC" },
  { id: "e5", source: "server", target: "db", label: "TCP/5432" },
  { id: "e6", source: "db", target: "cache", label: "Internal" },
];

export default async function ArchitecturePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("title")
    .eq("id", id)
    .single();

  const projectTitle = project?.title || "Architecture Matrix";

  const { data: sections } = await supabase
    .from("blueprint_sections")
    .select("*")
    .eq("project_id", id);

  const arch = sections?.find((s) => s.section_type === "architecture")?.content as Record<string, any> | undefined;
  
  const rawNodes = arch?.nodes as any[];
  const rawEdges = (arch?.edges || arch?.connections) as any[];

  let nodes = defaultNodes;
  let edges = defaultEdges;

  if (rawNodes && rawNodes.length > 0 && typeof rawNodes[0].position === "object") {
    nodes = rawNodes.map(n => ({
      ...n,
      type: 'architecture',
      data: {
        ...n.data,
        type: n.data.type || 'server',
        tech: n.data.tech || n.data.techStack?.[0]?.name || "Tech",
        aiNotes: n.data.aiNotes || "Detailed notes available in project insights.",
        efficiencyGrade: n.data.efficiencyGrade || "A"
      }
    }));
  }
  
  if (rawEdges && rawEdges.length > 0) {
    edges = rawEdges.map(e => ({
      id: e.id || `e-${e.source || e.from}-${e.target || e.to}`,
      source: e.source || e.from,
      target: e.target || e.to,
      label: e.label || "Flow",
      animated: e.animated || true
    }));
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-[#0b0f1a] relative overflow-hidden">
      <ArchitectureCanvas 
         initialNodes={nodes} 
         initialEdges={edges} 
         projectTitle={projectTitle}
       />
    </div>
  );
}
