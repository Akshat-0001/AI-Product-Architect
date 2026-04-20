import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Archie — AI Product Architect",
  description:
    "Transform your product ideas into complete system blueprints with AI. Free, open source, BYOK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <Script id="theme-persistence" strategy="beforeInteractive">
          {`
            try {
              const stored = localStorage.getItem('archie-theme-storage');
              if (stored) {
                const state = JSON.parse(stored).state;
                if (state && typeof state.isDark === 'boolean') {
                  if (state.isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }
              }
            } catch (e) {}
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
