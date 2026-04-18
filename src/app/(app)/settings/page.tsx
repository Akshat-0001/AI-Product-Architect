import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.user_metadata?.full_name || user?.email || "Architect";
  const email = user?.email || "";

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-on-surface mb-2">Profile</h1>
      <p className="text-on-surface-variant mb-8">Manage your account details</p>

      <div className="glass-panel ghost-border rounded-2xl p-8">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-3xl font-bold text-on-primary">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface">{name}</h3>
            <p className="text-sm text-on-surface-variant">{email}</p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1 block">Open Source Contributor</span>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Display Name</label>
            <input type="text" defaultValue={name} className="w-full bg-surface-container-highest/40 border-0 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Email</label>
            <input type="email" defaultValue={email} disabled className="w-full bg-surface-container-highest/20 border-0 rounded-xl py-3 px-4 text-on-surface-variant cursor-not-allowed" />
          </div>
        </div>

        <button className="mt-6 gradient-button px-6 py-2.5 rounded-xl text-on-primary font-semibold text-sm">Save Changes</button>
      </div>
    </div>
  );
}
