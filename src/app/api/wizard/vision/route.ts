import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are Archie, a friendly and expert AI Systems Architect. 
Your job is to take a simple project idea (the "Spark") and expand it into a professional "System Vision".

REQUIREMENTS:
- MODERATE TECHNICALITY: Use professional terms but explain them simply. Avoid extremely complex infrastructure jargon.
- STRUCTURED VISION: Identify 3 core "Architectural Pillars" that make this project robust.
- INSPIRATIONAL: Make the student feel like they are building something real and scalable.

Return a valid JSON object strictly matching this schema:
{
  "vision": {
    "title": "A professional, catchy name for the system",
    "summary": "1-2 sentence high-level vision of the system",
    "pillars": [
      { "title": "Pillar Title", "description": "How this pillar helps the project", "icon": "material_icon" }
    ],
    "scaleGoal": "A simple statement about what this system can handle (e.g., 'Designed to handle 10,000+ calculations per hour with zero data loss')"
  }
}`;

async function generateWithGroq(key: string, idea: string) {
  const groq = new Groq({ apiKey: key });
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Project Idea: ${idea}` },
    ],
    temperature: 0.7,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0]?.message?.content || "{}");
}

async function generateWithGemini(key: string, idea: string) {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
  });
  const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nProject Idea: ${idea}`);
  return JSON.parse(result.response.text());
}

export async function POST(req: Request) {
  try {
    const { idea, provider } = await req.json();
    const key = req.headers.get("X-AI-Key");

    if (!key) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = provider === "gemini" 
      ? await generateWithGemini(key, idea) 
      : await generateWithGroq(key, idea);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to expand vision" }, { status: 500 });
  }
}
