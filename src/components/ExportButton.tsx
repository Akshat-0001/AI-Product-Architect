"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface ExportButtonProps {
  projectId: string;
  projectName: string;
}

export default function ExportButton({ projectId, projectName }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    const supabase = createClient();

    try {
      const { data: sections, error } = await supabase
        .from("blueprint_sections")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;
      if (!sections || sections.length === 0) {
        alert("No blueprint sections found to export.");
        return;
      }

      const zip = new JSZip();
      const folder = zip.folder(projectName.replace(/[^a-z0-9]/gi, "_").toLowerCase() + "_blueprint");

      sections.forEach((section) => {
        let content = "";
        const data = section.content as any;

        if (section.section_type === "req_spec" || section.section_type === "design_doc" || section.section_type === "rollout_plan") {
          content = data.markdown || "";
        } else if (section.section_type === "api") {
          content = "# API Endpoints\n\n";
          data.endpoints?.forEach((ep: any) => {
            content += `## ${ep.method} ${ep.path}\n${ep.description}\n\n`;
          });
        } else if (section.section_type === "database") {
          content = "# Database Schema\n\n";
          data.tables?.forEach((table: any) => {
            content += `## Table: ${table.name}\n`;
            table.columns?.forEach((col: any) => {
              content += `- ${col.name} (${col.type})${col.primary ? " [PK]" : ""}\n`;
            });
            content += "\n";
          });
        } else {
          content = JSON.stringify(data, null, 2);
        }

        folder?.file(`${section.section_type}.md`, content);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${projectName.replace(/[^a-z0-9]/gi, "_")}_blueprint.zip`);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export blueprint.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full mt-6 flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-tertiary hover:bg-tertiary/10 border border-tertiary/20 transition-all disabled:opacity-50"
    >
      {isExporting ? (
        <div className="w-4 h-4 border-2 border-tertiary/20 border-t-tertiary rounded-full animate-spin" />
      ) : (
        <span className="material-symbols-outlined text-lg">download</span>
      )}
      {isExporting ? "Exporting..." : "Export Blueprint"}
    </button>
  );
}
