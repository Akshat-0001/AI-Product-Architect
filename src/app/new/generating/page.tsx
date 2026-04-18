"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizardStore";
import { createClient } from "@/lib/supabase/client";
import { getKey, getActiveProvider } from "@/lib/byok";

const logEntries = [
  { time: "00:00.12", msg: "Initializing blueprint synthesis engine...", status: "SUCCESS" },
  { time: "00:01.34", msg: "Parsing project requirements graph...", status: "SUCCESS" },
  { time: "00:03.21", msg: "Generating architecture matrix...", status: "IN PROGRESS" },
  { time: "00:05.44", msg: "Designing database schema (ERD)...", status: "IN PROGRESS" },
  { time: "00:08.02", msg: "Mapping API endpoint specifications...", status: "IN PROGRESS" },
  { time: "00:10.15", msg: "Compiling user story acceptance criteria...", status: "pending" },
  { time: "00:12.30", msg: "Scaffolding code structure...", status: "pending" },
  { time: "00:14.00", msg: "Running architecture optimization pass...", status: "pending" },
];

export default function WizardStep4() {
  const { ideaText, answers, selectedStyle, setStep, setGeneratedProjectId } = useWizardStore();
  const [progress, setProgress] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState(1);
  const [statusText, setStatusText] = useState("Initializing synthesis...");
  const router = useRouter();

  useEffect(() => {
    const provider = getActiveProvider();
    const key = getKey(provider);

    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 200);

    // Simulate log entries appearing
    const logInterval = setInterval(() => {
      setVisibleLogs((l) => {
        if (l >= logEntries.length) {
          clearInterval(logInterval);
          return logEntries.length;
        }
        return l + 1;
      });
    }, 1500);

    // Status text updates
    const statuses = ["Designing architecture...", "Mapping data models...", "Generating API specs...", "Compiling user stories...", "Optimizing blueprint..."];
    let si = 0;
    const statusInterval = setInterval(() => {
      si = (si + 1) % statuses.length;
      setStatusText(statuses[si]);
    }, 3000);

    // Create project in Supabase and generate blueprint
    const createProject = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const projectName = ideaText.slice(0, 50) || "New Project";
      const { data: project } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectName,
          idea_text: ideaText,
          answers: answers,
          selected_style: selectedStyle,
          status: "in_progress",
        })
        .select()
        .single();

      if (project) {
        setGeneratedProjectId(project.id);

        let success = false;
        // If user has a BYOK key, attempt real generation
        if (key) {
          try {
            const res = await fetch("/api/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-AI-Key": key,
              },
              body: JSON.stringify({
                idea: ideaText,
                answers,
                style: selectedStyle,
                provider,
                projectId: project.id,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.blueprint) {
                const sectionsToInsert = Object.entries(data.blueprint).map(([type, content]) => ({
                  project_id: project.id,
                  section_type: type,
                  content: content,
                  version: 1
                }));
                
                await supabase.from("blueprint_sections").insert(sectionsToInsert);
                await supabase.from("projects").update({ status: "completed" }).eq("id", project.id);
                success = true;
              }
            } else {
              console.warn("Generation failed, using demo data");
            }
          } catch (e) {
            console.error("Generation request failed", e);
          }
        }

        // Navigate to complete after generation finishes or fallback demo triggers (12s)
        if (success) {
          setStep(5);
          router.push("/new/complete");
        } else {
          setTimeout(() => {
            setStep(5);
            router.push("/new/complete");
          }, 12000);
        }
      }
    };

    createProject();

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div className="min-h-screen blueprint-grid relative flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px]" />

      {/* Central Animation */}
      <div className="relative w-96 h-96 flex items-center justify-center mb-12">
        {/* Outer Ping Ring */}
        <div className="absolute inset-0 border border-primary/20 rounded-2xl animate-ping" style={{ animationDuration: "3s" }} />
        {/* Pulse Ring */}
        <div className="absolute inset-8 border border-primary/30 rounded-2xl animate-pulse" />
        {/* Core Card */}
        <div className="w-64 h-64 bg-surface-container-highest/40 backdrop-blur-xl rounded-2xl border border-outline-variant/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-primary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
        </div>

        {/* Orbiting Nodes */}
        <div className="absolute -top-4 -right-4 bg-surface-container-highest/80 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant/20 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-primary text-sm">database</span>
          <span className="text-xs text-on-surface-variant">Schema</span>
        </div>
        <div className="absolute -bottom-4 -left-4 bg-surface-container-highest/80 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant/20 flex items-center gap-2 animate-bounce" style={{ animationDelay: "1s" }}>
          <span className="material-symbols-outlined text-primary text-sm">code</span>
          <span className="text-xs text-on-surface-variant">Scaffold</span>
        </div>
        <div className="absolute top-1/2 -left-8 bg-surface-container-highest/80 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant/20 flex items-center gap-2 animate-pulse">
          <span className="material-symbols-outlined text-primary text-sm">api</span>
          <span className="text-xs text-on-surface-variant">API</span>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface flex items-center justify-center gap-3">
          {statusText}
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </h2>
        <p className="text-on-surface-variant mt-2">Synthesizing blueprint for your project</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md relative z-10 mb-8">
        <div className="relative h-1.5 bg-surface-container-highest rounded-full">
          <div
            className="absolute h-full bg-gradient-to-r from-primary-container via-primary to-white rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(173,198,255,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-xs text-on-surface-variant">
          <span>Initiated</span>
          <span className="text-primary font-medium">{progress}% Optimized</span>
          <span>Deploying</span>
        </div>
      </div>

      {/* Terminal Log */}
      <div className="w-full max-w-lg glass-panel ghost-border rounded-xl p-4 relative z-10">
        <div className="font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
          {logEntries.slice(0, visibleLogs).map((log, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-primary/60">[{log.time}]</span>
              <span className="text-on-surface-variant flex-1">{log.msg}</span>
              <span className={`text-[10px] font-bold uppercase ${
                log.status === "SUCCESS" ? "text-tertiary" :
                log.status === "IN PROGRESS" ? "text-primary" :
                "text-on-surface-variant/40 italic"
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cards (xl screens) */}
      <div className="hidden xl:block absolute bottom-12 left-12 glass-panel ghost-border rounded-xl p-4 z-10">
        <div className="flex items-center gap-2 text-primary text-xs font-medium">
          <span className="material-symbols-outlined text-sm">speed</span>
          Processing Power
        </div>
        <p className="text-2xl font-bold text-on-surface mt-1">847 TFLOPS</p>
      </div>
      <div className="hidden xl:block absolute bottom-12 right-12 glass-panel ghost-border rounded-xl p-4 z-10">
        <div className="flex items-center gap-2 text-tertiary text-xs font-medium">
          <span className="material-symbols-outlined text-sm">verified</span>
          AI Integrity
        </div>
        <p className="text-2xl font-bold text-on-surface mt-1">99.7%</p>
      </div>
    </div>
  );
}
