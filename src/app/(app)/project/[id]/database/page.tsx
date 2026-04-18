import { createClient } from "@/lib/supabase/server";
import DatabaseEditor from "@/components/DatabaseEditor";

interface Props {
  params: Promise<{ id: string }>;
}

const defaultTables = [
  {
    name: "users",
    columns: [
      { name: "id", type: "UUID", primary: true, nullable: false, references: null },
      { name: "email", type: "VARCHAR", primary: false, nullable: false, references: null },
    ],
  }
];

export default async function DatabasePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("blueprint_sections")
    .select("*")
    .eq("project_id", id);

  const dbSection = sections?.find((s) => s.section_type === "database")?.content as Record<string, unknown> | undefined;
  const tables = (dbSection?.tables as typeof defaultTables) || defaultTables;

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-on-surface">Database Schema</h2>
        <p className="text-on-surface-variant text-sm mt-1">Interactive Entity Relationship Model</p>
      </div>

      <div className="flex-1">
        <DatabaseEditor initialTables={tables} />
      </div>
    </div>
  );
}
