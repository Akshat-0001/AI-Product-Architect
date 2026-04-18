// lib/byok.ts — Bring Your Own Key management
// Keys are stored ONLY in browser localStorage — never sent to Archie's servers

type Provider = "groq" | "gemini";

const STORAGE_KEYS = {
  groq: "archie_groq_key",
  gemini: "archie_gemini_key",
  preference: "archie_ai_preference",
  fallback: "archie_ai_fallback",
} as const;

export function saveKey(provider: Provider, key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS[provider], key);
}

export function getKey(provider: Provider): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS[provider]);
}

export function removeKey(provider: Provider): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS[provider]);
}

export function hasAnyKey(): boolean {
  return !!(getKey("groq") || getKey("gemini"));
}

export function getActiveProvider(): Provider {
  if (typeof window === "undefined") return "groq";
  return (localStorage.getItem(STORAGE_KEYS.preference) as Provider) || "groq";
}

export function setActiveProvider(provider: Provider): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.preference, provider);
}

export function isFallbackEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEYS.fallback) !== "false";
}

export function setFallbackEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.fallback, String(enabled));
}

export async function validateGroqKey(key: string): Promise<boolean> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function validateGeminiKey(key: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    return res.ok;
  } catch {
    return false;
  }
}
