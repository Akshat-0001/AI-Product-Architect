"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizardStore";
import Link from "next/link";

const suggestions = [
  "E-commerce platform",
  "SaaS dashboard",
  "Social network",
  "AI assistant",
];

export default function WizardStep1() {
  const { ideaText, setIdeaText, setStep } = useWizardStore();
  const [text, setText] = useState(ideaText);
  const router = useRouter();

  const handleNext = () => {
    setIdeaText(text);
    setStep(2);
    router.push("/new/questions");
  };

  const handleSuggestion = (suggestion: string) => {
    setText(suggestion);
  };

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 w-full bg-surface-container-low flex justify-between items-center px-8 py-4 z-50">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-primary tracking-tight">
            Architect Canvas
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <Link href="/dashboard" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">close</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 pb-32">
        <div className="w-full max-w-3xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              What are we building today?
            </h1>
            <p className="text-on-surface-variant text-lg font-light tracking-wide">
              Articulate your vision. We&apos;ll handle the architectural scaffolding.
            </p>
          </div>

          {/* Textarea with glow */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-container rounded-xl blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
            <div className="relative bg-surface-container-highest rounded-xl overflow-hidden">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 bg-transparent border-none text-on-surface p-8 text-xl focus:ring-0 placeholder:text-outline-variant resize-none"
                placeholder="Describe your idea..."
              />
            </div>
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="px-6 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-all duration-300 text-sm font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="fixed bottom-0 left-0 w-full h-24 bg-surface-container-low/60 backdrop-blur-xl border-t border-outline-variant/15 flex justify-between items-center px-12 z-50">
        {/* Step Icons */}
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center justify-center text-primary scale-110">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            <span className="text-[10px] uppercase tracking-widest">Idea</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-500 opacity-50">
            <span className="material-symbols-outlined mb-1">architecture</span>
            <span className="text-[10px] uppercase tracking-widest">Scope</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-500 opacity-50">
            <span className="material-symbols-outlined mb-1">visibility</span>
            <span className="text-[10px] uppercase tracking-widest">Review</span>
          </div>
        </div>

        {/* Center Label */}
        <div className="hidden md:block text-slate-400 font-medium tracking-tight">
          Step 1 of 5
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={text.trim().length < 5}
          className="px-10 py-3 gradient-button text-on-primary font-bold rounded-xl shadow-lg flex items-center gap-2 group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </footer>

      {/* Decorative Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full pointer-events-none" />
    </>
  );
}
