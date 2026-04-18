import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SYNC_PROMPT = `You are Archie, an expert AI Systems Architect. The user has manually updated their system architecture and database schema in the Interactive Blueprint Canvas. Your job is to parse these manual changes and COMPLETELY REWRITE the API Endpoints, Requirements Spec, Design Doc, and Rollout Plan to perfectly align with their new structural choices.

Ensure you do not return the architecture or database back. Return only the updated sections as valid JSON matching this schema:
{
  "api": {
    "endpoints": [{ "method": "GET|POST", "path": "/api/...", "description": "string" }]
  },
  "req_spec": {
    "markdown": "# Requirements Specification\\n\\n..."
  },
  "design_doc": {
    "markdown": "# High-Level Design (HLD)\\n\\n..."
  },
  "rollout_plan": {
    "markdown": "# Implementation & Rollout Plan\\n\\n..."
  }
}`;

async function syncWithGroq(key: string, originalContext: string, newArch: any, newDb: any) {
  const groq = new Groq({ apiKey: key });
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYNC_PROMPT },
      {
        role: "user",
        content: `Original Project Context (Overview):\n${originalContext}
        
NEW MANUAL ARCHITECTURE:
${JSON.stringify(newArch, null, 2)}

NEW MANUAL DATABASE SCHEMA:
${JSON.stringify(newDb, null, 2)}

Generate the updated sync sections now.`,
      },
    ],
    temperature: 0.6,
    max_tokens: 8000,
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0]?.message?.content || "{}");
}

async function syncWithGemini(key: string, originalContext: string, newArch: any, newDb: any) {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.6,
      maxOutputTokens: 8000,
    },
  });

  const prompt = `${SYNC_PROMPT}\n\nOriginal Project Context (Overview):\n${originalContext}\n\nNEW MANUAL ARCHITECTURE:\n${JSON.stringify(newArch)}\n\nNEW MANUAL DATABASE SCHEMA:\n${JSON.stringify(newDb)}\n\nGenerate the updated sync sections now.`;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function POST(req: Request) {
  try {
    const { projectId, architecture, database, provider } = await req.json();
    const key = req.headers.get("X-AI-Key");

    if (!key) {
      return NextResponse.json({ error: "No API key provided" }, { status: 401 });
    }

    // Fetch the project overview context from Supabase
    const { data: overviewRes } = await supabaseAdmin
      .from("blueprint_sections")
      .select("content")
      .eq("project_id", projectId)
      .eq("section_type", "overview")
      .single();

    const originalContext = JSON.stringify(overviewRes?.content || {});

    // Generate changes
    let syncedData;
    if (provider === "gemini") {
      syncedData = await syncWithGemini(key, originalContext, architecture, database);
    } else {
      syncedData = await syncWithGroq(key, originalContext, architecture, database);
    }

    // First update the architecture and DB themselves
    if (architecture) {
      await supabaseAdmin.from("blueprint_sections").upsert({ project_id: projectId, section_type: "architecture", content: architecture });
    }
    if (database) {
      await supabaseAdmin.from("blueprint_sections").upsert({ project_id: projectId, section_type: "database", content: database });
    }

    // Update the other generated fields
    const updates = [];
    if (syncedData.api) updates.push({ project_id: projectId, section_type: "api", content: syncedData.api });
    if (syncedData.req_spec) updates.push({ project_id: projectId, section_type: "req_spec", content: syncedData.req_spec });
    if (syncedData.design_doc) updates.push({ project_id: projectId, section_type: "design_doc", content: syncedData.design_doc });
    if (syncedData.rollout_plan) updates.push({ project_id: projectId, section_type: "rollout_plan", content: syncedData.rollout_plan });

    if (updates.length > 0) {
      await supabaseAdmin.from("blueprint_sections").upsert(updates);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Sync internal server error" }, { status: 500 });
  }
}
