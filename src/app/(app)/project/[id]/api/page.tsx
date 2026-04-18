import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

const defaultEndpoints = [
  { method: "GET", path: "/api/users", description: "List all users", requestBody: null, responseExample: '[{"id":"uuid","email":"user@example.com","name":"John"}]' },
  { method: "POST", path: "/api/users", description: "Create a new user", requestBody: '{"email":"string","name":"string","password":"string"}', responseExample: '{"id":"uuid","email":"user@example.com"}' },
  { method: "GET", path: "/api/projects", description: "List user projects", requestBody: null, responseExample: '[{"id":"uuid","name":"My Project","status":"active"}]' },
  { method: "POST", path: "/api/projects", description: "Create a new project", requestBody: '{"name":"string","description":"string"}', responseExample: '{"id":"uuid","name":"New Project"}' },
  { method: "GET", path: "/api/projects/:id", description: "Get project details", requestBody: null, responseExample: '{"id":"uuid","name":"Project","status":"active","tasks":[]}' },
  { method: "PUT", path: "/api/projects/:id", description: "Update a project", requestBody: '{"name":"string","status":"string"}', responseExample: '{"id":"uuid","name":"Updated"}' },
  { method: "DELETE", path: "/api/projects/:id", description: "Delete a project", requestBody: null, responseExample: '{"success":true}' },
  { method: "POST", path: "/api/auth/login", description: "Authenticate user", requestBody: '{"email":"string","password":"string"}', responseExample: '{"token":"jwt_token","user":{}}' },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-500/20 text-green-400 border-green-500/30",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  PATCH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default async function ApiEndpointsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("blueprint_sections")
    .select("*")
    .eq("project_id", id);

  const apiSection = sections?.find((s) => s.section_type === "api")?.content as Record<string, unknown> | undefined;
  const endpoints = (apiSection?.endpoints as typeof defaultEndpoints) || defaultEndpoints;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">API Endpoints</h2>
          <p className="text-on-surface-variant text-sm mt-1">{endpoints.length} endpoints defined</p>
        </div>
        <div className="flex items-center gap-2">
          {["GET", "POST", "PUT", "DELETE"].map((m) => (
            <span key={m} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${methodColors[m]}`}>{m}</span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {endpoints.map((endpoint, i) => (
          <div key={i} className="glass-panel ghost-border rounded-xl overflow-hidden">
            {/* Endpoint Header */}
            <div className="flex items-center gap-4 px-5 py-4">
              <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded border min-w-[60px] text-center ${methodColors[endpoint.method] || methodColors.GET}`}>
                {endpoint.method}
              </span>
              <code className="text-primary font-mono text-sm flex-1">{endpoint.path}</code>
              <span className="text-on-surface-variant text-sm">{endpoint.description}</span>
            </div>

            {/* Expandable Details */}
            <div className="border-t border-outline-variant/10 px-5 py-4 bg-surface-container-lowest/30">
              <div className="grid grid-cols-2 gap-6">
                {endpoint.requestBody && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">Request Body</h4>
                    <pre className="bg-surface-container-lowest rounded-lg p-3 text-xs font-mono text-on-surface-variant overflow-x-auto">
                      {endpoint.requestBody}
                    </pre>
                  </div>
                )}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">Response Example</h4>
                  <pre className="bg-surface-container-lowest rounded-lg p-3 text-xs font-mono text-on-surface-variant overflow-x-auto">
                    {endpoint.responseExample}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
