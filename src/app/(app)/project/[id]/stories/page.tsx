import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

const defaultEpics = [
  {
    name: "Authentication",
    stories: [
      { title: "User Registration", description: "As a new user, I want to create an account so that I can access the platform", priority: "high", acceptanceCriteria: ["Email validation", "Password strength check", "Confirmation email sent", "Profile auto-created"] },
      { title: "Social Login", description: "As a user, I want to sign in with GitHub so that I can skip password setup", priority: "high", acceptanceCriteria: ["GitHub OAuth flow", "Profile sync from provider", "Session persistence"] },
      { title: "Password Reset", description: "As a user, I want to reset my password so that I can regain access", priority: "medium", acceptanceCriteria: ["Reset email sent", "Token expiry (1h)", "New password validation"] },
    ],
  },
  {
    name: "Project Management",
    stories: [
      { title: "Create Project", description: "As a user, I want to create a new project so that I can start my blueprint", priority: "high", acceptanceCriteria: ["Name required", "Default settings applied", "Redirect to wizard"] },
      { title: "View Dashboard", description: "As a user, I want to see all my projects so that I can manage them", priority: "high", acceptanceCriteria: ["Grid layout", "Status badges", "Sort by date"] },
      { title: "Delete Project", description: "As a user, I want to delete a project so that I can clean up", priority: "low", acceptanceCriteria: ["Confirmation modal", "Cascade delete sections", "Toast notification"] },
    ],
  },
  {
    name: "Blueprint Generation",
    stories: [
      { title: "AI Blueprint", description: "As a user, I want to generate a blueprint from my idea so that I get technical specs", priority: "high", acceptanceCriteria: ["5-section output", "Real-time progress", "Error fallback"] },
      { title: "Share Blueprint", description: "As a user, I want to share my blueprint so that others can view it", priority: "medium", acceptanceCriteria: ["Public URL generated", "Read-only view", "Branding footer"] },
    ],
  },
];

const priorityColors: Record<string, string> = {
  high: "bg-error/10 text-error border-error/20",
  medium: "bg-tertiary/10 text-tertiary border-tertiary/20",
  low: "bg-on-surface-variant/10 text-on-surface-variant border-on-surface-variant/20",
};

export default async function UserStoriesPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("blueprint_sections")
    .select("*")
    .eq("project_id", id);

  const storiesSection = sections?.find((s) => s.section_type === "stories")?.content as Record<string, unknown> | undefined;
  const epics = (storiesSection?.epics as typeof defaultEpics) || defaultEpics;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-on-surface">User Stories</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          {epics.reduce((acc, e) => acc + e.stories.length, 0)} stories across {epics.length} epics
        </p>
      </div>

      <div className="space-y-8">
        {epics.map((epic) => (
          <div key={epic.name}>
            {/* Epic Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
              <h3 className="text-lg font-bold text-on-surface">{epic.name}</h3>
              <span className="text-xs text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-full">{epic.stories.length} stories</span>
            </div>

            {/* Stories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {epic.stories.map((story, i) => (
                <div key={i} className="glass-panel ghost-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-bold text-on-surface">{story.title}</h4>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${priorityColors[story.priority]}`}>
                      {story.priority}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-xs mb-4 italic">{story.description}</p>
                  <div>
                    <h5 className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">Acceptance Criteria</h5>
                    <ul className="space-y-1">
                      {story.acceptanceCriteria.map((ac, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary/50 text-xs">check_box</span>
                          {ac}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
