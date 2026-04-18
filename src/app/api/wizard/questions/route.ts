import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are Archie, an expert AI Systems Architect. The user is providing a high-level product idea for a software application.
Your job is to generate exactly 5 highly specific, technical system-design questions that will help clarify the backend architecture, scalability, security, or data modeling choices.
These MUST NOT BE generic questions like "who is the target audience". They must be highly contextual to their specific idea.

Return a valid JSON object matching this exact structure:
{
  "questions": [
    {
      "id": "short_unique_key",
      "question": "The actual technical question text",
      "insight": "A brief 1-sentence insight explaining WHY this structural decision matters.",
      "options": [
        { "icon": "lock", "title": "Short Option Name", "subtitle": "Brief implication detail" },
        { "icon": "speed", "title": "Short Option Name", "subtitle": "Brief implication detail" },
        { "icon": "database", "title": "...", "subtitle": "..." },
        { "icon": "api", "title": "...", "subtitle": "..." }
      ]
    }
  ]
}`;

async function generateWithGroq(key: string, idea: string) {
  const groq = new Groq({ apiKey: key });
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Product Idea: ${idea}\n\nGenerate the 5 technical design questions now.` },
    ],
    temperature: 0.7,
    max_tokens: 3000,
    response_format: { type: "json_object" },
  });
  
  const rawContent = response.choices[0]?.message?.content || "{}";
  try {
    const content = JSON.parse(rawContent);
    return Array.isArray(content) ? content : (content.questions || content);
  } catch (err) {
    console.error("Groq JSON Parse Error:", err, "Raw content:", rawContent);
    throw new Error("Invalid AI Response JSON");
  }
}

async function generateWithGemini(key: string, idea: string) {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const prompt = `${SYSTEM_PROMPT}\n\nProduct Idea: ${idea}\n\nGenerate the 5 technical design questions now.`;
  const result = await model.generateContent(prompt);
  const content = JSON.parse(result.response.text());
  return Array.isArray(content) ? content : (content.questions || content);
}

export async function POST(req: Request) {
  try {
    const { idea, provider } = await req.json();
    const key = req.headers.get("X-AI-Key");

    if (!key) {
      return NextResponse.json({ error: "No API key provided" }, { status: 401 });
    }

    let questions;

    try {
      if (provider === "gemini") {
        questions = await generateWithGemini(key, idea);
      } else {
        questions = await generateWithGroq(key, idea);
      }
    } catch (primaryError) {
      console.error("Questions generation failed:", primaryError);
      return NextResponse.json(
        { error: "Generation failed. Check your API key and try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Generate questions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
