export default function HelpSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-on-surface mb-2">Help & Support</h1>
      <p className="text-on-surface-variant mb-8">Get assistance with Archie and your architectural workflows.</p>

      <div className="glass-panel ghost-border rounded-2xl p-8 space-y-6">
        <a href="mailto:support@example.com" className="block p-4 border border-outline-variant/20 rounded-xl hover:bg-surface-container transition-colors group">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">mail</span>
            <h3 className="font-bold text-on-surface">Email Support</h3>
          </div>
          <p className="text-sm text-on-surface-variant ml-9">Contact our support team directly for assistance.</p>
        </a>

        <a href="https://github.com/archie/docs" target="_blank" rel="noopener noreferrer" className="block p-4 border border-outline-variant/20 rounded-xl hover:bg-surface-container transition-colors group">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">menu_book</span>
            <h3 className="font-bold text-on-surface">Documentation</h3>
          </div>
          <p className="text-sm text-on-surface-variant ml-9">Read our comprehensive guides and API references.</p>
        </a>
      </div>
    </div>
  );
}
