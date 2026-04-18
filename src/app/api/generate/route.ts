import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are Archie, an expert AI Systems Architect. Generate a professional system architecture blueprint for a software product. Return a valid JSON object strictly matching this schema:

{
  "overview": {
    "title": "Project name",
    "description": "2-3 sentence summary",
    "purpose": "Core purpose statement",
    "metrics": { "estimatedLinesOfCode": 0, "microservices": 0, "databaseTables": 0, "apiEndpoints": 0 },
    "techStack": ["technology1", "technology2"],
    "keyFeatures": ["feature1", "feature2"]
  },
  "architecture": {
    "nodes": [{"id": "unique-string", "position": {"x": 0, "y": 0}, "data": {"label": "Component Name", "type": "backend|frontend|database|external", "description": "Short description"}}],
    "edges": [{"id": "edge-id", "source": "node-id-1", "target": "node-id-2", "label": "Protocol", "animated": true}]
  },
  "database": {
    "tables": [{ "name": "string", "columns": [{ "name": "string", "type": "string", "primary": false, "nullable": false, "references": "table.column|null" }] }]
  },
  "api": {
    "endpoints": [{ "method": "GET|POST|PUT|DELETE", "path": "/api/...", "description": "string", "requestBody": "description|null", "responseExample": "JSON string" }]
  },
  "req_spec": {
    "markdown": "# Requirements Specification\\n\\nHighly detailed markdown doc covering functional and non-functional requirements. Use tables and bullet points."
  },
  "design_doc": {
    "markdown": "# High-Level Design (HLD)\\n\\nHighly detailed markdown doc covering system constraints, design choices, trade-offs, and data flow mechanisms."
  },
  "rollout_plan": {
    "markdown": "# Implementation & Rollout Plan\\n\\nStep-by-step phases for deploying this architecture to production. Cover CI/CD, testing, and scaling."
  }
}`;

async function generateWithGroq(
  key: string,
  idea: string,
  answers: unknown[],
  style: string
) {
  const groq = new Groq({ apiKey: key });
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Product Idea: ${idea}\n\nDesign Answers: ${JSON.stringify(answers)}\n\nVisual Style: ${style}\n\nGenerate the complete blueprint now.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 6000,
    response_format: { type: "json_object" },
  });
  
  const rawContent = response.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(rawContent);
  } catch (err) {
    console.error("Groq JSON Parse Error:", err, "Raw content:", rawContent);
    throw new Error("Invalid AI Response JSON");
  }
}

async function generateWithGemini(
  key: string,
  idea: string,
  answers: unknown[],
  style: string
) {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
      maxOutputTokens: 8000,
    },
  });

  const prompt = `${SYSTEM_PROMPT}\n\nProduct Idea: ${idea}\n\nDesign Answers: ${JSON.stringify(answers)}\n\nVisual Style: ${style}\n\nGenerate the complete blueprint now.`;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function POST(req: Request) {
  try {
    const { idea, answers, style, provider, projectId } = await req.json();
    const key = req.headers.get("X-AI-Key");

    if (!key) {
      return NextResponse.json({ error: "No API key provided" }, { status: 401 });
    }

    let blueprint;

    try {
      if (provider === "gemini") {
        blueprint = await generateWithGemini(key, idea, answers, style);
      } else {
        blueprint = await generateWithGroq(key, idea, answers, style);
      }
    } catch (primaryError) {
      // Auto-fallback to other provider could be implemented here
      console.error("Primary provider failed:", primaryError);
      return NextResponse.json(
        { error: "Generation failed. Check your API key and try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ blueprint, projectId });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
