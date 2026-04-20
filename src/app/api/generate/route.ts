import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT_TEXT = `You are Archie, a friendly and expert AI Systems Architect. Generate a professional system architecture blueprint for a software product. 

CRITICAL REQUIREMENTS:
- MODERATE TECHNICALITY: Use professional concepts (e.g., Caching, API Gateways) but explain them in simple, educational terms. Avoid overly complex academic jargon. 
- VISION AWARE: Align your design with the provided "System Vision" and architectural pillars.
- COMPREHENSIVENESS: Generate 8-12 architecture nodes and 6-10 database tables with proper relationships.
- EDUCATIONAL VALUE: Use the 'aiNotes' field to provide friendly design insights for a student.

Return a valid JSON object strictly matching this schema:`;

const JSON_SCHEMA = {
  "overview": {
    "title": "Project name",
    "description": "Professional 2-3 sentence summary",
    "purpose": "Core purpose statement",
    "metrics": { "estimatedLinesOfCode": 0, "microservices": 0, "databaseTables": 0, "apiEndpoints": 0 },
    "techStack": ["Examples: Next.js, Go, PostgreSQL, Redis, AWS Lambda"],
    "keyFeatures": ["feature1", "feature2"]
  },
  "architecture": {
    "description": "Logical diagrammatic flow. Break down high-level concepts into specific services (e.g., 'Worker Node' instead of 'Backend').",
    "nodes": [
      {
        "id": "unique-id", 
        "position": {"x": 100, "y": 100}, 
        "data": {
          "label": "Detailed Component Name", 
          "type": "user|web|mobile|gateway|firewall|server|lambda|database|cache|storage|queue|pubsub|ai_model|analytics|cdn|dns|auth", 
          "description": "Explain functionality and architectural significance.",
          "techStack": [{"name": "tech", "detail": "purpose", "icon": "material_icon"}],
          "aiNotes": "Deep performance or scaling insight for students.",
          "efficiencyGrade": "A|B|C"
        }
      }
    ],
    "edges": [{"id": "edge-id", "source": "node-1", "target": "node-2", "label": "Protocol/Action", "animated": true}]
  },
  "database": {
    "nodes": [
      {
        "id": "table-name",
        "position": {"x": 100, "y": 100},
        "data": {
          "label": "Table Name",
          "description": "Purpose of this entity",
          "columns": [
            { "name": "id", "type": "UUID", "primary": true, "nullable": false },
            { "name": "field", "type": "VARCHAR", "primary": false, "nullable": true, "references": "other_table.id|null" }
          ],
          "aiNotes": "Normalization audit or indexing strategy insight.",
          "efficiencyGrade": "A|B|C"
        }
      }
    ],
    "edges": [{"id": "edge-id", "source": "table-1", "target": "table-2", "label": "Constraint (1:N, 1:1, M:N)", "animated": false}]
  },
  "api": {
    "endpoints": [{ "method": "GET|POST|PUT|DELETE", "path": "/api/...", "description": "string", "requestBody": "description|null", "responseExample": "JSON string" }]
  },
  "req_spec": {
    "markdown": "# Requirements Specification\n\nHighly detailed doc. Use tables."
  },
  "design_doc": {
    "markdown": "# High-Level Design (HLD)\n\nConstraints and trade-offs."
  },
  "rollout_plan": {
    "markdown": "# Implementation & Rollout Plan\n\nStep-by-step phases."
  }
};

const SYSTEM_PROMPT = SYSTEM_PROMPT_TEXT + "\n\n" + JSON.stringify(JSON_SCHEMA, null, 2);

async function generateWithGroq(
  key: string,
  idea: string,
  answers: unknown[],
  style: string,
  vision: any
) {
  const groq = new Groq({ apiKey: key });
  const visionContext = vision ? `\n\nSystem Vision:\nTitle: ${vision.title}\nSummary: ${vision.summary}` : "";
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Product Idea: ${idea}${visionContext}\n\nDesign Answers: ${JSON.stringify(answers)}\n\nVisual Style: ${style}\n\nGenerate the complete blueprint now.`,
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
  style: string,
  vision: any
) {
  const genAI = new GoogleGenerativeAI(key);
  const visionContext = vision ? `\n\nSystem Vision:\nTitle: ${vision.title}\nSummary: ${vision.summary}` : "";
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
      maxOutputTokens: 8000,
    },
  });

  const prompt = `${SYSTEM_PROMPT}\n\nProduct Idea: ${idea}${visionContext}\n\nDesign Answers: ${JSON.stringify(answers)}\n\nVisual Style: ${style}\n\nGenerate the complete blueprint now.`;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function POST(req: Request) {
  try {
    const { idea, answers, style, provider, projectId, vision } = await req.json();
    const key = req.headers.get("X-AI-Key");

    if (!key) {
      return NextResponse.json({ error: "No API key provided" }, { status: 401 });
    }

    let blueprint;

    try {
      if (provider === "gemini") {
        blueprint = await generateWithGemini(key, idea, answers, style, vision);
      } else {
        blueprint = await generateWithGroq(key, idea, answers, style, vision);
      }
    } catch (primaryError) {
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
