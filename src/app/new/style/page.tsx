"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizardStore";

const styles = [
  { id: "glassmorphism", name: "Glassmorphism", desc: "Frosted layers, soft depth", bg: "bg-gradient-to-br from-indigo-500/20 to-blue-500/20", accent: "border-indigo-400/30" },
  { id: "neo-brutalism", name: "Neo-Brutalism", desc: "Bold borders, offset shadows", bg: "bg-white", accent: "border-black", dark: false },
  { id: "saas-modern", name: "SaaS Modern", desc: "Deep dark, professional", bg: "bg-[#0b1326]", accent: "border-primary/30" },
  { id: "deep-ocean", name: "Deep Ocean", desc: "Atmospheric gradient", bg: "bg-gradient-to-b from-[#001e3c] to-[#000d1a]", accent: "border-blue-800/30" },
  { id: "cyberpunk", name: "Cyberpunk", desc: "Neon glow effects", bg: "bg-black", accent: "border-pink-500/30" },
  { id: "minimalist", name: "Minimalist", desc: "Maximum whitespace", bg: "bg-slate-100", accent: "border-slate-300", dark: false },
  { id: "enterprise-dark", name: "Enterprise Dark", desc: "Subtle grid tiles", bg: "bg-[#1e1e1e]", accent: "border-gray-700/30" },
  { id: "pastel-soft", name: "Pastel Soft", desc: "Warm and inviting", bg: "bg-gradient-to-br from-purple-200 to-rose-200", accent: "border-purple-300/30", dark: false },
  { id: "high-contrast", name: "High Contrast", desc: "Maximum impact", bg: "bg-black", accent: "border-white/30" },
  { id: "retro-terminal", name: "Retro Terminal", desc: "Green monospace", bg: "bg-[#0a0a0a]", accent: "border-green-500/30" },
];

export default function WizardStep3() {
  const { selectedStyle, setSelectedStyle, setStep } = useWizardStore();
  const [selected, setSelected] = useState(selectedStyle);
  const router = useRouter();

  const handleContinue = () => {
    setSelectedStyle(selected);
    setStep(4);
    router.push("/new/generating");
  };

  const activeStyle = styles.find((s) => s.id === selected) || styles[2];

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 w-full bg-surface-container-low flex justify-between items-center px-8 py-4 z-50">
        <span className="text-xl font-bold text-primary tracking-tight">Architect Canvas</span>
        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-primary transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <button onClick={() => router.push("/dashboard")} className="hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main className="flex-grow pt-20 pb-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-3">Pick your visual direction</h1>
            <p className="text-on-surface-variant text-lg">Choose a style that matches your product&apos;s personality.</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Style Cards — Left 7 cols */}
            <div className="col-span-7">
              <div className="grid grid-cols-2 gap-4">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelected(style.id)}
                    className={`relative rounded-xl p-3 text-left transition-all duration-200 ${
                      selected === style.id
                        ? "bg-surface-container-high border-2 border-primary shadow-[0_0_20px_rgba(173,198,255,0.15)]"
                        : "bg-surface-container-low border border-outline-variant/10 hover:border-primary/40"
                    }`}
                  >
                    {selected === style.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-on-primary text-sm">check</span>
                      </div>
                    )}
                    <div className={`aspect-square rounded-lg mb-3 ${style.bg} ${style.accent} border flex items-center justify-center overflow-hidden`}>
                      {style.id === "cyberpunk" && (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="absolute w-full h-px bg-pink-500 shadow-[0_0_10px_#ec4899]" />
                          <div className="absolute w-px h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                        </div>
                      )}
                      {style.id === "retro-terminal" && (
                        <p className="text-green-400 font-mono text-xs p-3">&gt; system load...</p>
                      )}
                      {style.id === "high-contrast" && (
                        <div className="w-16 h-16 rounded-full border-2 border-white" />
                      )}
                      {style.id === "minimalist" && (
                        <div className="w-12 h-12 border border-slate-400" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-white">{style.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview — Right 5 cols */}
            <div className="col-span-5">
              <div className="sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-on-surface">Live Preview: {activeStyle.name}</h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Active Theme</span>
                </div>
                <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant/15">
                  {/* Login Card Mockup */}
                  <div className={`${activeStyle.bg} rounded-xl p-6 mb-4 ${activeStyle.accent} border`}>
                    <div className={`h-3 w-20 ${activeStyle.dark === false ? "bg-gray-300" : "bg-white/20"} rounded mb-4`} />
                    <div className={`h-8 w-full ${activeStyle.dark === false ? "bg-gray-200" : "bg-white/10"} rounded mb-3`} />
                    <div className={`h-8 w-full ${activeStyle.dark === false ? "bg-gray-200" : "bg-white/10"} rounded mb-4`} />
                    <div className="h-8 w-full bg-primary/60 rounded" />
                  </div>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[1, 2].map((i) => (
                      <div key={i} className={`${activeStyle.bg} rounded-lg p-4 ${activeStyle.accent} border`}>
                        <div className={`h-2 w-10 ${activeStyle.dark === false ? "bg-gray-300" : "bg-white/20"} rounded mb-2`} />
                        <div className={`h-5 w-16 ${activeStyle.dark === false ? "bg-gray-400" : "bg-white/30"} rounded`} />
                      </div>
                    ))}
                  </div>
                  {/* Action Card */}
                  <div className={`${activeStyle.bg} rounded-lg p-4 ${activeStyle.accent} border`}>
                    <div className={`h-2 w-24 ${activeStyle.dark === false ? "bg-gray-300" : "bg-white/20"} rounded mb-3`} />
                    <div className="h-7 w-20 bg-primary/50 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="fixed bottom-0 left-0 w-full h-20 bg-surface-container-low/60 backdrop-blur-xl border-t border-outline-variant/15 flex justify-between items-center px-12 z-50">
        <button onClick={() => { setStep(2); router.push("/new/questions"); }} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface border border-outline-variant/20 px-6 py-2 rounded-xl transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`rounded-full transition-all ${i === 3 ? "w-4 h-2 bg-primary shadow-lg shadow-primary/40" : "w-2 h-2 bg-outline-variant/40"}`} />
          ))}
          <span className="text-xs text-slate-400 ml-2">Step 3 of 5</span>
        </div>
        <button onClick={handleContinue} className="px-10 py-3 gradient-button text-on-primary font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all duration-300">
          Continue
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </footer>
    </>
  );
}
