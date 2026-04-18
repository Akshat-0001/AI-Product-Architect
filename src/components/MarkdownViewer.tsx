"use client";

import ReactMarkdown from "react-markdown";

export default function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-indigo max-w-none text-slate-300
                    prose-headings:text-slate-50 prose-headings:font-[var(--font-headline)]
                    prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                    prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-100 prose-code:text-primary-fixed
                    glass-panel ghost-border rounded-xl p-8"
    >
      <ReactMarkdown>
        {content || "*No content generated yet.*"}
      </ReactMarkdown>
    </div>
  );
}
