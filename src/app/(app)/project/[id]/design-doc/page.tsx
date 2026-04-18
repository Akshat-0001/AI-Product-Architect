import { createClient } from "@/lib/supabase/server";
import MarkdownViewer from "@/components/MarkdownViewer";

export default async function DesignDocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("blueprint_sections")
    .select("content")
    .eq("project_id", id)
    .eq("section_type", "design_doc")
    .single();

  const content = (sections?.content as any)?.markdown || "";

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">High-Level Design Document (HLD)</h2>
          <p className="text-on-surface-variant text-sm mt-1">Deep dive into data flows, trade-offs, and scaling bottlenecks</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <MarkdownViewer content={content} />
      </div>
    </div>
  );
}
