"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizardStore";
import { getKey, getActiveProvider } from "@/lib/byok";

const fallbackQuestions = [
  {
    id: "user_type",
    question: "Who is the primary user of this product?",
    insight: "Understanding your target user shapes every architectural decision from auth to data models.",
    options: [
      { icon: "person", title: "Individual Consumers", subtitle: "B2C end users" },
      { icon: "business", title: "Business Teams", subtitle: "B2B organizations" },
      { icon: "engineering", title: "Developers", subtitle: "Technical users & APIs" },
      { icon: "groups", title: "Mixed Audience", subtitle: "Multiple user types" },
    ],
  },
  {
    id: "scale",
    question: "What scale are you targeting at launch?",
    insight: "Scale determines database choice, caching strategy, and infrastructure complexity.",
    options: [
      { icon: "person", title: "MVP / Prototype", subtitle: "< 100 users" },
      { icon: "group", title: "Small Scale", subtitle: "100-1,000 users" },
      { icon: "groups", title: "Medium Scale", subtitle: "1,000-50,000 users" },
      { icon: "public", title: "Large Scale", subtitle: "50,000+ users" },
    ],
  },
  {
    id: "realtime",
    question: "Does your product need real-time features?",
    insight: "Real-time capabilities significantly impact your tech stack and hosting costs.",
    options: [
      { icon: "flash_off", title: "No Real-time", subtitle: "Standard request/response" },
      { icon: "notifications", title: "Notifications Only", subtitle: "Push alerts & updates" },
      { icon: "chat", title: "Live Chat/Collab", subtitle: "WebSocket connections" },
      { icon: "stream", title: "Real-time Streaming", subtitle: "Live data feeds" },
    ],
  },
  {
    id: "auth",
    question: "What authentication method fits best?",
    insight: "Auth choice affects user experience, security posture, and third-party integrations.",
    options: [
      { icon: "email", title: "Email + Password", subtitle: "Traditional auth" },
      { icon: "login", title: "Social OAuth", subtitle: "Google, GitHub, etc." },
      { icon: "key", title: "API Keys", subtitle: "Developer-focused" },
      { icon: "security", title: "Enterprise SSO", subtitle: "SAML / OIDC" },
    ],
  },
  {
    id: "data_model",
    question: "How complex is your data model?",
    insight: "Data complexity drives database schema design and query optimization strategies.",
    options: [
      { icon: "table_chart", title: "Simple CRUD", subtitle: "< 5 entities" },
      { icon: "schema", title: "Relational", subtitle: "5-15 entities with joins" },
      { icon: "hub", title: "Complex Graph", subtitle: "Deeply nested relationships" },
      { icon: "analytics", title: "Analytics-Heavy", subtitle: "Time-series / aggregations" },
    ],
  },
];

interface Option {
  icon: string;
  title: string;
  subtitle: string;
}

interface Question {
  id: string;
  question: string;
  insight: string;
  options: Option[];
}

export default function WizardStep2() {
  const { ideaText, answers, addAnswer, setStep } = useWizardStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(answers.length);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleFetch = useCallback(async () => {
    const provider = getActiveProvider();
    const key = getKey(provider);
    
    if (!key) {
      setQuestions(fallbackQuestions);
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch("/api/wizard/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-AI-Key": key },
        body: JSON.stringify({ idea: ideaText, provider }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions.slice(0, 5)); // Enforce max 5
        } else {
          setQuestions(fallbackQuestions);
        }
      } else {
        setQuestions(fallbackQuestions);
      }
    } catch (e) {
      console.error("Failed to fetch questions", e);
      setQuestions(fallbackQuestions);
    } finally {
      setLoading(false);
    }
  }, [ideaText]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center pt-24 pb-32">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-on-surface mb-2">Analyzing your architecture...</h2>
        <p className="text-on-surface-variant max-w-sm">Generating context-specific technical questions based on your product idea.</p>
      </div>
    );
  }

  const question = questions[currentQ];
  if (!question) {
    setStep(3);
    router.push("/new/style");
    return null;
  }

  const handleAnswer = (option: { title: string }) => {
    addAnswer({
      questionId: question.id,
      question: question.question,
      answer: option.title,
      answerLabel: option.title,
    });
    if (currentQ + 1 >= questions.length) {
      setStep(3);
      router.push("/new/style");
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 w-full bg-surface-container-low px-8 py-5 z-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary">New Project Wizard</h2>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Step 2: The Questioning Engine</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">Question {currentQ + 1} of {questions.length}</p>
            <div className="w-48 h-1.5 bg-surface-container-highest rounded-full mt-2">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        {/* Dot Stepper */}
        <div className="flex gap-2 mt-4">
          {questions.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < currentQ ? "bg-primary/40" : i === currentQ ? "bg-primary" : "border border-outline-variant"}`} />
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-40 pb-32">
        <div className="w-full max-w-2xl space-y-8">
          {/* Previous Answers */}
          {answers.length > 0 && (
            <div className="space-y-3 opacity-60">
              {answers.slice(-2).map((a, i) => (
                <div key={i} className="flex justify-end">
                  <div className="bg-surface-container-high px-4 py-2 rounded-xl text-sm text-on-surface max-w-xs">
                    {a.answerLabel}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Question */}
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div className="flex-1">
              <div className="glass-panel ghost-border rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-slate-50 mb-2">{question.question}</h2>
              </div>

              {/* Answer Chips — 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <button
                    key={opt.title + i}
                    onClick={() => handleAnswer(opt)}
                    className="group bg-surface-container-highest border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-high rounded-xl p-4 text-left transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 group-hover:text-tertiary transition-all block">{opt.icon}</span>
                    <p className="text-slate-100 text-sm font-medium leading-tight">{opt.title}</p>
                    <p className="text-on-surface-variant text-xs mt-1 leading-snug">{opt.subtitle}</p>
                  </button>
                ))}
              </div>

              {/* AI Insight */}
              <div className="flex items-center gap-3 bg-tertiary/10 border border-tertiary/20 rounded-full px-4 py-2 mt-6">
                <span className="material-symbols-outlined text-tertiary text-sm">auto_awesome</span>
                <p className="text-tertiary-fixed text-xs flex-1">{question.insight}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="fixed bottom-0 left-0 w-full h-20 bg-surface-container-low/60 backdrop-blur-xl border-t border-outline-variant/15 flex justify-between items-center px-12 z-50">
        <button
          onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          disabled={currentQ === 0}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Previous
        </button>
        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <div key={i} className={`rounded-full transition-all ${i === currentQ ? "w-4 h-2 bg-primary shadow-lg shadow-primary/40" : "w-2 h-2 bg-outline-variant/40"}`} />
          ))}
        </div>
        <button
          onClick={() => handleAnswer({ title: "Skipped" })}
          className="text-primary hover:underline text-sm"
        >
          Skip
        </button>
      </footer>
    </>
  );
}
