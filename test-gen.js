const Groq = require("groq-sdk");
require("dotenv").config({ path: ".env.local" });

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

async function main() {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Product Idea: A discord clone\n\nDesign Answers: []\n\nVisual Style: minimalist\n\nGenerate the complete blueprint now.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 6000,
    response_format: { type: "json_object" },
  });
  console.log(response.choices[0]?.message?.content);
}

main().catch(console.error);
