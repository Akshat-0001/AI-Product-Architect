"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNav = [
  { label: "Profile", icon: "account_circle", href: "/settings" },
  { label: "Architecture", icon: "architecture", href: "/settings/architecture" },
  { label: "API Metrics", icon: "analytics", href: "/settings/metrics" },
  { label: "Security", icon: "shield", href: "/settings/security" },
  { label: "API Keys", icon: "key", href: "/settings/api-keys" },
  { label: "Help", icon: "help", href: "/settings/help" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex">
      {/* Settings Sidebar */}
      <aside className="w-64 min-h-[calc(100vh-64px)] bg-surface-container-low/50 border-r border-outline-variant/10 py-8 px-4">
        <h2 className="text-lg font-bold text-on-surface mb-6 px-4">Settings</h2>
        <nav className="space-y-1">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-lg" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 py-8 px-10">{children}</div>
    </div>
  );
}
