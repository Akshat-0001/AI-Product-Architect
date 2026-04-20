"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import ExportButton from "@/components/ExportButton";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const blueprintNav = [
  { label: "Overview", icon: "dashboard", href: "" },
  { label: "Architecture", icon: "hub", href: "/architecture" },
  { label: "Database", icon: "database", href: "/database" },
  { label: "API Endpoints", icon: "api", href: "/api" },
  { label: "Requirements", icon: "list_alt", href: "/req-spec" },
  { label: "Design Doc", icon: "architecture", href: "/design-doc" },
  { label: "Rollout Plan", icon: "rocket_launch", href: "/rollout-plan" },
];

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.id as string;
  const [projectName, setProjectName] = useState("Project");

  useEffect(() => {
    const fetchProject = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("projects").select("name").eq("id", projectId).single();
      if (data) setProjectName(data.name);
    };
    fetchProject();
  }, [projectId]);

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Blueprint Inner Nav */}
      <nav className="w-56 bg-surface-container-low/30 border-r border-outline-variant/10 py-6 px-3 flex flex-col">
        <div className="mb-6 px-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/50">
            Blueprint
          </span>
        </div>
        <div className="space-y-0.5 flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
          {blueprintNav.map((item) => {
            const fullHref = `/project/${projectId}${item.href}`;
            const isActive = pathname === fullHref;
            return (
              <Link
                key={item.label}
                href={fullHref}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-all ${
                  isActive
                    ? "text-indigo-400 bg-indigo-500/10 font-medium"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
        
        <div className="pt-4 border-t border-outline-variant/10">
          <ExportButton projectId={projectId} projectName={projectName} />
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
