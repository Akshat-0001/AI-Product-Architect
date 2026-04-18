import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-slate-950/60 backdrop-blur-xl">
        <div className="text-xl font-bold tracking-tighter text-slate-50">
          Archie
        </div>
        <div className="hidden md:flex gap-8 items-center text-sm tracking-tight">
          <a href="#features" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">Features</a>
          <a href="#output" className="text-slate-400 hover:text-indigo-300 transition-colors">Solutions</a>
          <a href="#" className="text-slate-400 hover:text-indigo-300 transition-colors">Documentation</a>
          <a href="https://github.com" className="text-slate-400 hover:text-indigo-300 transition-colors">GitHub</a>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/auth" className="text-slate-400 text-sm hover:text-slate-100 transition-all">Log In</Link>
          <Link href="/auth" className="gradient-button px-5 py-2 rounded-lg text-on-primary font-semibold text-sm shadow-lg shadow-primary/10">Get Started</Link>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          {/* Decorative Gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full" />

          <div className="relative z-10 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight text-on-surface mb-6">
              Build your product blueprint{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
                in minutes
              </span>
              , not weeks.
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Archie is the world&apos;s first AI Product Architect. Translate your vision into detailed PRDs, database schemas, and API documentation with precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth" className="gradient-button px-8 py-4 rounded-xl text-on-primary font-bold text-lg flex items-center gap-3 group transition-transform hover:scale-[1.02]">
                Start Building
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link href="#features" className="px-8 py-4 rounded-xl text-on-surface border border-outline-variant/20 font-semibold text-lg hover:bg-surface-container-low transition-colors">
                View Sample Blueprint
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex items-center justify-center gap-8 opacity-70">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">42,840+</div>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant">Blueprints Generated</div>
              </div>
              <div className="w-px h-10 bg-outline-variant/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98.4%</div>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant">Architect Accuracy</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-20 w-full max-w-5xl rounded-2xl overflow-hidden border border-outline-variant/10 shadow-2xl relative aspect-video">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 via-surface to-tertiary-container/10 flex items-center justify-center">
              <div className="text-center space-y-4 opacity-60">
                <span className="material-symbols-outlined text-7xl text-primary/40" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
                <p className="text-on-surface-variant text-lg">Blueprint Dashboard Preview</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          </div>
        </section>

        {/* 3-Step Explainer */}
        <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Precision Engineering for Ideas</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">Skip the blank page. Our AI engine processes logic, not just language.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "edit_note", title: "1. Describe", desc: "Tell Archie about your product vision in plain English. No technical jargon required.", color: "text-primary" },
              { icon: "forum", title: "2. Answer", desc: "Archie asks targeted questions about user roles, data flows, and edge cases to refine your logic.", color: "text-tertiary" },
              { icon: "architecture", title: "3. Get Blueprint", desc: "Receive a complete technical dossier including ERDs, API schemas, and comprehensive user stories.", color: "text-primary" },
            ].map((step) => (
              <div key={step.title} className="glass-panel p-8 rounded-3xl border border-outline-variant/10 group hover:border-primary/30 transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-6 ${step.color}`}>
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-50 mb-4">{step.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Style Preview Strip */}
        <section id="output" className="py-12 bg-surface-container-low/50">
          <div className="text-center mb-10 px-8">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Output Formats</span>
          </div>
          <div className="flex overflow-hidden gap-6 px-8 select-none">
            {["Architecture Diagrams", "Database Schemas", "API Documentation", "User Stories", "Code Scaffolds", "Style Guides"].map((label) => (
              <div key={label} className="flex-none w-64 h-40 rounded-xl overflow-hidden border border-outline-variant/20 hover:scale-105 transition-transform duration-500 bg-surface-container flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-3xl text-primary/40 mb-2">description</span>
                  <p className="text-on-surface-variant text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-8 text-center relative">
          <div className="max-w-4xl mx-auto glass-panel py-16 px-10 rounded-[3rem] border border-outline-variant/10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-4xl font-extrabold text-on-surface mb-6">Stop guessing. Start building.</h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-xl mx-auto">Join thousands of founders and product managers who use Archie to de-risk their technical roadmaps.</p>
            <div className="flex justify-center">
              <Link href="/auth" className="gradient-button px-12 py-5 rounded-2xl text-on-primary font-bold text-xl shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
                Launch Your First Project
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest py-20 px-8 border-t border-outline-variant/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <div className="text-2xl font-bold tracking-tighter text-slate-50 mb-6">Archie</div>
            <p className="text-on-surface-variant text-sm max-w-xs mb-6">The AI-native platform designed for product architects, engineers, and visionary founders. Open source &amp; free.</p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">share</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">terminal</span>
              </div>
            </div>
          </div>
          {[
            { title: "Platform", links: ["Features", "Integrations", "Open Source", "Roadmap"] },
            { title: "Company", links: ["About Us", "GitHub", "Blog", "Contact"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-slate-100 mb-6 uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                {col.links.map((link) => (
                  <li key={link}><a className="hover:text-primary" href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-6 uppercase tracking-widest">Status</h4>
            <div className="flex items-center gap-2 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-xs">© 2026 Archie AI. Built for the modern architect. MIT Licensed.</p>
          <div className="flex gap-6 text-xs text-on-surface-variant uppercase tracking-tighter">
            <span>v2.4.0 (Latest Release)</span>
            <span className="text-primary cursor-pointer hover:underline">Star on GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
