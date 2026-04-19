export default function SecuritySettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-on-surface mb-2">Security</h1>
      <p className="text-on-surface-variant mb-8">Manage your account security and authentication methods.</p>

      <div className="glass-panel ghost-border rounded-2xl p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-on-surface mb-1">Password</h3>
          <p className="text-sm text-on-surface-variant mb-4">You can change your password here if you logged in with an email.</p>
          <button className="gradient-button px-6 py-2.5 rounded-xl text-on-primary font-semibold text-sm">Change Password</button>
        </div>
        
        <div className="h-px bg-outline-variant/20 my-6" />
        
        <div>
          <h3 className="text-xl font-bold text-on-surface mb-1">Two-Factor Authentication</h3>
          <p className="text-sm text-on-surface-variant mb-4">Add an extra layer of security to your account.</p>
          <button className="border border-outline-variant/30 hover:bg-surface-container px-6 py-2.5 rounded-xl text-on-surface font-semibold text-sm transition-colors">Enable 2FA</button>
        </div>
      </div>
    </div>
  );
}
