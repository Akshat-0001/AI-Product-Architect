"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "My Projects", icon: "folder_open", href: "/projects" },
  { label: "Explore", icon: "explore", href: "/explore" },
  { label: "Recent Projects", icon: "history", href: "/recent" },
];

const bottomNav = [
  { label: "Settings", icon: "settings", href: "/settings" },
];

import { useThemeStore } from "@/stores/themeStore";

export default function Sidebar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-40 bg-slate-900 w-[240px] text-slate-300">
      {/* Logo */}
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary">
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            architecture
          </span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-50 leading-none tracking-tight font-[var(--font-headline)]">
            Archie
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
            Product Architect
          </p>
        </div>
      </div>

      {/* New Project CTA */}
      <div className="px-4 mb-4">
        <Link
          href="/new"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 gradient-button text-on-primary font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Project
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-2 space-y-1">
        {mainNav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 py-3 px-4 transition-all text-sm ${
                isActive
                  ? "text-indigo-400 border-l-4 border-indigo-500 bg-slate-800/50"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100 border-l-4 border-transparent"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-4 py-6 border-t border-slate-800/50 space-y-1">
        {bottomNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 py-3 px-4 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all text-sm"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 py-3 px-4 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all text-sm"
        >
          <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
}
