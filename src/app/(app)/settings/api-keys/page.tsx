"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  getKey, saveKey, removeKey,
  getActiveProvider, setActiveProvider,
  isFallbackEnabled, setFallbackEnabled,
  validateGroqKey, validateGeminiKey,
} from "@/lib/byok";

type ValidationStatus = "idle" | "validating" | "valid" | "invalid";

function ApiKeysContent() {
  const searchParams = useSearchParams();
  const isSetup = searchParams.get("setup") === "true";

  const [groqKey, setGroqKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [groqStatus, setGroqStatus] = useState<ValidationStatus>("idle");
  const [geminiStatus, setGeminiStatus] = useState<ValidationStatus>("idle");
  const [showGroq, setShowGroq] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [preferred, setPreferred] = useState<"groq" | "gemini">("groq");
  const [fallback, setFallback] = useState(true);

  useEffect(() => {
    const gk = getKey("groq");
    const gmk = getKey("gemini");
    if (gk) { setGroqKey(gk); setGroqStatus("valid"); }
    if (gmk) { setGeminiKey(gmk); setGeminiStatus("valid"); }
    setPreferred(getActiveProvider());
    setFallback(isFallbackEnabled());
  }, []);

  const handleValidateGroq = async () => {
    setGroqStatus("validating");
    const valid = await validateGroqKey(groqKey);
    setGroqStatus(valid ? "valid" : "invalid");
    if (valid) saveKey("groq", groqKey);
  };

  const handleValidateGemini = async () => {
    setGeminiStatus("validating");
    const valid = await validateGeminiKey(geminiKey);
    setGeminiStatus(valid ? "valid" : "invalid");
    if (valid) saveKey("gemini", geminiKey);
  };

  const handleClearGroq = () => {
    removeKey("groq");
    setGroqKey("");
    setGroqStatus("idle");
  };

  const handleClearGemini = () => {
    removeKey("gemini");
    setGeminiKey("");
    setGeminiStatus("idle");
  };

  const statusIcon = (status: ValidationStatus) => {
    switch (status) {
      case "validating": return <span className="material-symbols-outlined animate-spin text-primary text-lg">progress_activity</span>;
      case "valid": return <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>;
      case "invalid": return <span className="material-symbols-outlined text-error text-lg">cancel</span>;
      default: return null;
    }
  };

  return (
    <>
      {/* Setup Banner */}
      {isSetup && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-8 flex items-start gap-4">
          <span className="material-symbols-outlined text-primary text-2xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          <div>
            <h3 className="font-bold text-on-surface mb-1">Set up a key to start generating blueprints</h3>
            <p className="text-on-surface-variant text-sm">Add at least one API key below. Keys are stored locally in your browser and never sent to Archie&apos;s servers.</p>
          </div>
        </div>
      )}

      {/* Groq Key */}
      <div className="glass-panel ghost-border rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">bolt</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Groq</h3>
              <p className="text-xs text-on-surface-variant">Llama 3.1 70B — Fastest inference</p>
            </div>
          </div>
          {statusIcon(groqStatus)}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showGroq ? "text" : "password"}
              value={groqKey}
              onChange={(e) => { setGroqKey(e.target.value); setGroqStatus("idle"); }}
              placeholder="gsk_..."
              className="w-full bg-surface-container-highest/40 border-0 rounded-xl py-3 pl-4 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 font-mono text-sm"
            />
            <button onClick={() => setShowGroq(!showGroq)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-lg">{showGroq ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
          <button
            onClick={handleValidateGroq}
            disabled={!groqKey || groqStatus === "validating"}
            className="px-4 py-2 bg-surface-container-high text-on-surface text-sm font-medium rounded-xl hover:bg-surface-container-highest transition-colors disabled:opacity-50"
          >
            Validate
          </button>
          {groqStatus === "valid" && (
            <button onClick={handleClearGroq} className="px-3 py-2 text-error/60 hover:text-error transition-colors">
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          )}
        </div>
        <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-xs text-primary/60 hover:text-primary mt-3 inline-block">Get free Groq key →</a>
      </div>

      {/* Gemini Key */}
      <div className="glass-panel ghost-border rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Gemini</h3>
              <p className="text-xs text-on-surface-variant">Flash 2.0 — Best for large blueprints</p>
            </div>
          </div>
          {statusIcon(geminiStatus)}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showGemini ? "text" : "password"}
              value={geminiKey}
              onChange={(e) => { setGeminiKey(e.target.value); setGeminiStatus("idle"); }}
              placeholder="AIza..."
              className="w-full bg-surface-container-highest/40 border-0 rounded-xl py-3 pl-4 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 font-mono text-sm"
            />
            <button onClick={() => setShowGemini(!showGemini)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-lg">{showGemini ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
          <button
            onClick={handleValidateGemini}
            disabled={!geminiKey || geminiStatus === "validating"}
            className="px-4 py-2 bg-surface-container-high text-on-surface text-sm font-medium rounded-xl hover:bg-surface-container-highest transition-colors disabled:opacity-50"
          >
            Validate
          </button>
          {geminiStatus === "valid" && (
            <button onClick={handleClearGemini} className="px-3 py-2 text-error/60 hover:text-error transition-colors">
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          )}
        </div>
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-xs text-primary/60 hover:text-primary mt-3 inline-block">Get free Gemini key →</a>
      </div>

      {/* Preferences */}
      <div className="glass-panel ghost-border rounded-2xl p-6 mb-4">
        <h3 className="font-bold text-on-surface mb-4">Provider Preferences</h3>
        <div className="space-y-4">
          {/* Preferred Provider */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface text-sm font-medium">Preferred Provider</p>
              <p className="text-on-surface-variant text-xs">Which AI to use first for generation</p>
            </div>
            <div className="flex p-1 bg-surface-container-low rounded-lg">
              <button
                onClick={() => { setPreferred("groq"); setActiveProvider("groq"); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${preferred === "groq" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
              >Groq</button>
              <button
                onClick={() => { setPreferred("gemini"); setActiveProvider("gemini"); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${preferred === "gemini" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
              >Gemini</button>
            </div>
          </div>
          {/* Fallback */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface text-sm font-medium">Auto-Fallback</p>
              <p className="text-on-surface-variant text-xs">Automatically switch if preferred provider fails</p>
            </div>
            <button
              onClick={() => { setFallback(!fallback); setFallbackEnabled(!fallback); }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${fallback ? "bg-primary" : "bg-surface-container-highest"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${fallback ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-surface-container-low/50 rounded-2xl p-6 border border-outline-variant/10">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5">shield</span>
          <div>
            <h4 className="font-bold text-on-surface text-sm mb-1">Privacy First</h4>
            <p className="text-on-surface-variant text-xs leading-relaxed">Your key is stored only in this browser and sent directly to the AI provider. Archie never stores or logs your API keys. Keys are encrypted in transit via HTTPS.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ApiKeysPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-on-surface mb-2">API Keys</h1>
      <p className="text-on-surface-variant mb-8">Manage your AI provider keys for blueprint generation</p>

      <Suspense fallback={
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          <span>Loading settings...</span>
        </div>
      }>
        <ApiKeysContent />
      </Suspense>
    </div>
  );
}
