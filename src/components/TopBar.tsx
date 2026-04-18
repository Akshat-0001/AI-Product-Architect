"use client";

interface TopBarProps {
  showSearch?: boolean;
  title?: string;
  versionBadge?: string;
  showActions?: boolean;
}

export default function TopBar({
  showSearch = true,
  title,
  versionBadge,
  showActions = false,
}: TopBarProps) {
  return (
    <header className="flex justify-between items-center w-full px-8 h-16 bg-slate-950 text-xs uppercase tracking-widest sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        {title ? (
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight normal-case font-[var(--font-headline)]">
              {title}
            </h2>
            {versionBadge && (
              <span className="bg-surface-container-highest/50 text-primary border border-primary/20 rounded-full px-3 py-0.5 text-[10px] font-medium normal-case">
                {versionBadge}
              </span>
            )}
          </div>
        ) : showSearch ? (
          <div className="relative w-full max-w-xl">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search architectural assets..."
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-slate-600 normal-case tracking-normal text-sm"
            />
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-4 ml-8">
        {showActions && (
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-1.5 border border-outline-variant/20 text-on-surface rounded-full text-xs font-medium normal-case hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-sm">
                autorenew
              </span>
              Regenerate
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 border border-outline-variant/20 text-on-surface rounded-full text-xs font-medium normal-case hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-sm">share</span>
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-primary-container text-on-primary-container rounded-full text-xs font-medium normal-case hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              Export
            </button>
          </div>
        )}
        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-indigo-300 transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="hover:text-indigo-300 transition-all">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
