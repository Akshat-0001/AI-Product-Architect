import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const auditPrompt = `You are an expert Database Administrator. Review the provided SQL schema (JSON format) and identify potential flaws, missing relationships, normalization issues, or missing standard columns (like created_at, id).

Return a valid JSON object matching this schema:
{
  "suggestions": [
    { "type": "error|warning|info", "message": "The suggestion text", "impact": "Brief explanation of why this matters" }
  ]
}`;

export async function POST(req: Request) {
  try {
    const { tables } = await req.json();
    const key = req.headers.get("X-AI-Key");

    if (!key) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
    }

    const groq = new Groq({ apiKey: key });
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: auditPrompt },
        { role: "user", content: `Schema to audit:\n${JSON.stringify(tables, null, 2)}` },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(raw);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
