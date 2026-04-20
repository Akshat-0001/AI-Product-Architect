import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are Archie, a friendly and expert AI Systems Architect. The user is providing a product idea for their project.
Your job is to generate exactly 5 specific, moderate-level technical questions that will help them think about their system design.

REQUIREMENTS:
- MODERATE TECHNICALITY: Avoid highly academic jargon (e.g., instead of "eventual consistency," use "how fast should data update").
- ACCESSIBLE LANGUAGE: Use terms a student can understand, but keep it professional.
- CONTEXTUAL: Base the questions on their specific idea. 
- FORMAT: Generate 5 questions with 4 clear, descriptive options each.

Return a valid JSON object matching this exact structure:
{
  "questions": [
    {
      "id": "key",
      "question": "Standard/Moderate technical question",
      "insight": "Explain WHY this matters in simple terms.",
      "options": [
        { "icon": "material_icon", "title": "Simple Title", "subtitle": "Friendly explanation of the choice" }
      ]
    }
  ]
}`;

async function generateWithGroq(key: string, idea: string, vision: any) {
  const groq = new Groq({ apiKey: key });
  const visionContext = vision ? `\nSystem Vision: ${vision.title} - ${vision.summary}` : "";
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Product Idea: ${idea}${visionContext}\n\nGenerate the 5 technical design questions now.` },
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

async function generateWithGemini(key: string, idea: string, vision: any) {
  const genAI = new GoogleGenerativeAI(key);
  const visionContext = vision ? `\nSystem Vision: ${vision.title} - ${vision.summary}` : "";
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const prompt = `${SYSTEM_PROMPT}\n\nProduct Idea: ${idea}${visionContext}\n\nGenerate the 5 technical design questions now.`;
  const result = await model.generateContent(prompt);
  const content = JSON.parse(result.response.text());
  return Array.isArray(content) ? content : (content.questions || content);
}

export async function POST(req: Request) {
  try {
    const { idea, vision, provider } = await req.json();
    const key = req.headers.get("X-AI-Key");

    if (!key) {
      return NextResponse.json({ error: "No API key provided" }, { status: 401 });
    }

    let questions;

    try {
      if (provider === "gemini") {
        questions = await generateWithGemini(key, idea, vision);
      } else {
        questions = await generateWithGroq(key, idea, vision);
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
