"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizardStore";
import { getKey, getActiveProvider } from "@/lib/byok";
import Link from "next/link";

export default function VisionPage() {
  const { ideaText, vision, setVision, setStep } = useWizardStore();
  const [loading, setLoading] = useState(!vision);
  const router = useRouter();

  useEffect(() => {
    if (vision) {
        setLoading(false);
        return;
    }

    const fetchVision = async () => {
      const provider = getActiveProvider();
      const key = getKey(provider);
      
      if (!key) {
          // Fallback if no key
          setVision({
              title: "Modern Application Design",
              summary: "A robust and scalable foundation for your project idea.",
              pillars: [
                  { title: "User Focus", description: "Designing for a seamless experience.", icon: "person" },
                  { title: "Data Integrity", description: "Ensuring your data is safe and organized.", icon: "database" },
                  { title: "Modern Stack", description: "Built with industry-standard technologies.", icon: "bolt" }
              ],
              scaleGoal: "Tailored for your specific project needs."
          });
          setLoading(false);
          return;
      }

      try {
        const res = await fetch("/api/wizard/vision", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-AI-Key": key },
          body: JSON.stringify({ idea: ideaText, provider }),
        });
        const data = await res.json();
        setVision(data.vision);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchVision();
  }, [ideaText, vision, setVision]);

  const handleNext = () => {
    setStep(2);
    router.push("/new/questions");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center pt-24 pb-32">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-on-surface mb-2">Archie is brainstorming...</h2>
        <p className="text-on-surface-variant max-w-sm">Expanding your spark into a professional vision using friendly, moderate technicality.</p>
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 w-full bg-surface-container-low flex justify-between items-center px-8 py-4 z-50">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-primary tracking-tight">Archie AI</span>
        </div>
        <Link href="/dashboard" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined">close</span>
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 pb-32">
        <div className="w-full max-w-4xl space-y-12">
          {/* Hero Vision */}
          <div className="text-center space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              System Vision
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight uppercase italic">
              {vision?.title}
            </h1>
            <p className="text-on-surface-variant text-xl max-w-2xl mx-auto font-light leading-relaxed">
              {vision?.summary}
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vision?.pillars.map((pillar, i) => (
              <div key={i} className="glass-panel ghost-border rounded-2xl p-6 hover:bg-surface-container-highest transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary">{pillar.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">{pillar.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Scale Insight */}
          <div className="bg-tertiary/5 border border-tertiary/20 rounded-2xl p-6 flex items-center gap-6 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-tertiary/20 flex items-center justify-center flex-shrink-0 animate-pulse">
              <span className="material-symbols-outlined text-tertiary-fixed">insights</span>
            </div>
            <div>
               <p className="text-xs uppercase tracking-widest font-bold text-tertiary/70 mb-1">Scaling Potential</p>
               <p className="text-on-surface font-medium italic">{vision?.scaleGoal}</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full h-24 bg-surface-container-low/60 backdrop-blur-xl border-t border-outline-variant/15 flex justify-between items-center px-12 z-50">
        <div className="flex items-center gap-12 opacit-50">
           <div className="flex flex-col items-center justify-center text-primary/60">
            <span className="material-symbols-outlined mb-1">lightbulb</span>
            <span className="text-[10px] uppercase tracking-widest">Idea</span>
          </div>
          <div className="flex flex-col items-center justify-center text-primary scale-110">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
            <span className="text-[10px] uppercase tracking-widest">Vision</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-500 opacity-50">
            <span className="material-symbols-outlined mb-1">architecture</span>
            <span className="text-[10px] uppercase tracking-widest">Scope</span>
          </div>
        </div>

        <div className="hidden md:block text-slate-400 font-medium tracking-tight">
          Step 1.5 of 5
        </div>

        <button
          onClick={handleNext}
          className="px-10 py-3 gradient-button text-on-primary font-bold rounded-xl shadow-lg flex items-center gap-2 group transition-all duration-300"
        >
          Confirm Vision
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </footer>
    </>
  );
}
