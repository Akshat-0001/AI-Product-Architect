"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

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
        <div className="flex items-center gap-4 text-slate-500 relative">
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotificationMenu(!showNotificationMenu);
                setShowProfileMenu(false);
              }}
              className="hover:text-indigo-300 transition-all flex items-center"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-surface border border-outline-variant/20 rounded-xl shadow-2xl py-2 z-50 normal-case tracking-normal">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-outline-variant/20 mb-2">
                  <h3 className="font-bold text-on-surface">Notifications</h3>
                  <button 
                    onClick={() => setShowNotificationMenu(false)}
                    className="text-xs text-primary hover:text-primary-fixed-dim transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="px-4 py-3 text-sm text-on-surface-variant text-center">
                  You have no new notifications.
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotificationMenu(false);
              }}
              className="hover:text-indigo-300 transition-all flex items-center"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant/20 rounded-xl shadow-2xl py-2 z-50 normal-case tracking-normal">
                <Link 
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors w-full"
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                  Settings
                </Link>
                <div className="h-px bg-outline-variant/20 my-1" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors w-full text-left"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
