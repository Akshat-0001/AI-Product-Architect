import { createClient } from "@/lib/supabase/server";
import DatabaseCanvas from "@/components/DatabaseCanvas";
import { Node, Edge } from "@xyflow/react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DatabasePage({ params }: Props) {
  const { id: projectId } = await params;
  const supabase = await createClient();

  // Fetch project for branding
  const { data: project } = await supabase
    .from("projects")
    .select("name")
    .eq("id", projectId)
    .single();

  const { data: sections } = await supabase
    .from("blueprint_sections")
    .select("*")
    .eq("project_id", projectId);

  const dbSection = sections?.find((s) => s.section_type === "database")?.content as any;
  
  // Transform legacy tables format into nodes/edges if necessary
  let nodes: Node[] = dbSection?.nodes || [];
  let edges: Edge[] = dbSection?.edges || [];

  if (nodes.length === 0 && dbSection?.tables) {
    // Basic Grid Transformation for legacy data
     nodes = dbSection.tables.map((table: any, idx: number) => ({
        id: table.name,
        type: 'database',
        position: { x: (idx % 4) * 300, y: Math.floor(idx / 4) * 250 },
        data: {
          label: table.name,
          description: `Data entity for ${table.name}`,
          columns: table.columns,
          aiNotes: "Legacy schema detected. Perform a refresh for full AI audit.",
          efficiencyGrade: "B"
        }
     }));

     // Infer edges from references
     edges = dbSection.tables.flatMap((table: any) => 
        table.columns
          .filter((col: any) => col.references)
          .map((col: any, idx: number) => ({
            id: `e-${table.name}-${col.references}-${idx}`,
            source: table.name,
            target: col.references.split('.')[0],
            label: 'references',
            animated: false
          }))
     );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-[#0b0f1a] relative overflow-hidden">
      <DatabaseCanvas 
         initialNodes={nodes} 
         initialEdges={edges} 
         projectTitle={project?.name}
       />
    </div>
  );
}
