interface FileItem {
  name: string;
  type: "file" | "folder";
  language?: string;
  children?: FileItem[];
}

export default function CodeScaffoldPage() {
  const files: FileItem[] = [
    { name: "src/", type: "folder", children: [
      { name: "app/", type: "folder", children: [
        { name: "layout.tsx", type: "file", language: "typescript" },
        { name: "page.tsx", type: "file", language: "typescript" },
        { name: "(app)/", type: "folder", children: [
          { name: "dashboard/", type: "folder", children: [
            { name: "page.tsx", type: "file", language: "typescript" },
          ]},
        ]},
        { name: "api/", type: "folder", children: [
          { name: "route.ts", type: "file", language: "typescript" },
        ]},
      ]},
      { name: "components/", type: "folder", children: [
        { name: "Sidebar.tsx", type: "file", language: "typescript" },
        { name: "TopBar.tsx", type: "file", language: "typescript" },
      ]},
      { name: "lib/", type: "folder", children: [
        { name: "supabase/", type: "folder", children: [
          { name: "client.ts", type: "file", language: "typescript" },
          { name: "server.ts", type: "file", language: "typescript" },
        ]},
        { name: "byok.ts", type: "file", language: "typescript" },
      ]},
    ]},
  ];

  const codePreview = `// src/app/api/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}`;

  const renderTree = (items: FileItem[], depth = 0) => (
    <div className="space-y-0.5">
      {items.map((item) => (
        <div key={item.name}>
          <div
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-sm hover:bg-surface-container transition-colors cursor-pointer ${
              item.name === "route.ts" ? "bg-primary/10 text-primary" : "text-on-surface-variant"
            }`}
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
          >
            <span className="material-symbols-outlined text-sm" style={item.type === "folder" ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.type === "folder" ? "folder" : "description"}
            </span>
            <span className={item.type === "folder" ? "font-medium text-on-surface" : "font-mono text-xs"}>{item.name}</span>
          </div>
          {item.type === "folder" && item.children && renderTree(item.children, depth + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-128px)]">
      {/* File Explorer */}
      <div className="w-72 bg-surface-container-low/50 border-r border-outline-variant/10 py-4 overflow-y-auto">
        <div className="px-4 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">File Explorer</span>
        </div>
        {renderTree(files)}
      </div>

      {/* Code Editor */}
      <div className="flex-1 bg-surface-container-lowest flex flex-col">
        {/* Editor Tab Bar */}
        <div className="flex items-center gap-0 bg-surface-container-low border-b border-outline-variant/10">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest text-primary text-xs border-r border-outline-variant/10">
            <span className="material-symbols-outlined text-xs">description</span>
            route.ts
            <span className="material-symbols-outlined text-on-surface-variant/40 text-xs ml-2 hover:text-on-surface cursor-pointer">close</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-6">
          <pre className="font-mono text-sm leading-7">
            {codePreview.split("\n").map((line, i) => (
              <div key={i} className="flex">
                <span className="w-10 text-right pr-4 text-on-surface-variant/30 select-none text-xs leading-7">{i + 1}</span>
                <code className="text-on-surface-variant">
                  {line.includes("import") ? (
                    <span>
                      <span className="text-purple-400">import</span>
                      <span className="text-on-surface-variant">{line.replace("import", "").replace("from", "")}</span>
                    </span>
                  ) : line.includes("export") ? (
                    <span>
                      <span className="text-purple-400">export </span>
                      <span className="text-blue-400">{line.replace("export ", "")}</span>
                    </span>
                  ) : line.includes("const") ? (
                    <span>
                      <span className="text-purple-400">  const </span>
                      <span className="text-on-surface">{line.replace("  const ", "")}</span>
                    </span>
                  ) : line.includes("//") ? (
                    <span className="text-on-surface-variant/40">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </code>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Metadata Sidebar */}
      <div className="w-64 bg-surface-container-low/50 border-l border-outline-variant/10 p-5 overflow-y-auto">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-4">File Metadata</h3>
        <div className="space-y-4">
          {[
            { label: "Language", value: "TypeScript" },
            { label: "Framework", value: "Next.js 16" },
            { label: "Lines", value: "22" },
            { label: "Dependencies", value: "2" },
            { label: "Last Modified", value: "Just now" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-on-surface-variant/60 mb-0.5">{item.label}</p>
              <p className="text-sm text-on-surface font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
