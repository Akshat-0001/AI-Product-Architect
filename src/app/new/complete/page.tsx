"use client";

import Link from "next/link";
import { useWizardStore } from "@/stores/wizardStore";

export default function WizardStep5() {
  const { generatedProjectId, reset } = useWizardStore();
  const projectUrl = generatedProjectId ? `/project/${generatedProjectId}` : "/dashboard";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Mesh Background */}
      <div className="absolute inset-0 -z-10" style={{
        background: "radial-gradient(circle at 50% 50%, rgba(0, 92, 198, 0.15) 0%, rgba(11, 19, 38, 0) 70%)"
      }} />

      {/* Success Content */}
      <div className="text-center max-w-2xl relative z-10">
        {/* Preview Card */}
        <div className="relative max-w-lg mx-auto aspect-video mb-10 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-surface-container-low border border-outline-variant/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-primary/20" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

          {/* Floating Overlays */}
          <div className="absolute top-4 right-4 glass-panel ghost-border rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
            <span className="text-xs text-on-surface font-medium">Compiled</span>
          </div>
          <div className="absolute bottom-4 left-4 glass-panel ghost-border rounded-lg px-3 py-2">
            <span className="text-xs text-on-surface-variant font-mono">Schema.v5</span>
          </div>
        </div>

        {/* Success Circle */}
        <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,92,198,0.4)]">
          <span className="material-symbols-outlined text-on-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>check_circle</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-on-surface mb-6">
          Your Blueprint<br />is ready.
        </h1>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href={projectUrl}
            onClick={() => reset()}
            className="gradient-button px-8 py-4 rounded-xl text-on-primary font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            View Blueprint
          </Link>
          <button className="px-8 py-4 rounded-xl text-on-surface border border-outline-variant/30 font-semibold text-lg hover:bg-surface-container transition-colors">
            Share Blueprint
          </button>
        </div>

        {/* 5-Dot Footer */}
        <div className="mt-16 flex items-center justify-center gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === 5
                  ? "bg-primary ring-4 ring-primary/20"
                  : "bg-outline-variant/30"
              }`}
            />
          ))}
        </div>
        <p className="text-on-surface-variant text-xs mt-3">Step 5 of 5</p>
      </div>
    </div>
  );
}
