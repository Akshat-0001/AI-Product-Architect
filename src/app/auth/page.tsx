"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

function AuthContent() {
  const searchParams = useSearchParams();
  const defaultIsLogin = searchParams.get("tab") !== "signup";
  
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [supabase.auth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isResetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });
        if (error) throw error;
        setMessage("Password reset email has been sent. Please check your inbox.");
        setEmail(""); // Clear email field after submission
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        
        // Handle Supabase "User Enumeration Protection" (Silent Success)
        // If identities is empty, it means the user already exists.
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          setError("This email is already registered. Please login instead.");
          setEmail("");
          setPassword("");
          return;
        }

        if (data?.user && !data?.session) {
          setMessage("Success! Please check your email for a confirmation link.");
          setEmail("");
          setPassword("");
        } else if (data?.session) {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes("user already registered")) {
        setError("This email is already registered. Please login instead.");
        setEmail("");
        setPassword("");
      } else {
        setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="bg-surface text-on-background min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-tertiary-container/5 rounded-full blur-[100px] -z-10" />

      {/* Dot Grid Background */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <div className="absolute inset-0 auth-dot-grid" />
      </div>

      {/* Branding */}
      <div className="mb-12 text-center">
        <h1 className="font-extrabold text-4xl tracking-tighter text-slate-50 mb-2">
          Archie
        </h1>
        <p className="text-on-surface-variant text-sm tracking-widest uppercase opacity-70">
          Product Architect Console
        </p>
      </div>

      {/* Auth Card */}
      <main className="w-full max-w-md">
        <div className="glass-panel ghost-border rounded-xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Toggle */}
          {!isResetMode && (
            <div className="flex p-1 bg-surface-container-low rounded-lg mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  isLogin
                    ? "text-primary bg-surface-container"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  !isLogin
                    ? "text-primary bg-surface-container"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {isResetMode && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-on-surface">Reset Password</h2>
              <p className="text-sm text-on-surface-variant mt-2">Enter your email to receive a password reset link.</p>
            </div>
          )}

          <div className="space-y-6">
            {/* GitHub OAuth */}
            {!isResetMode && (
              <button
                onClick={handleGitHub}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-highest/50 hover:bg-surface-container-highest text-on-surface rounded-xl text-sm font-medium transition-all duration-200 ghost-border"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                {isLogin ? "Log in with GitHub" : "Sign up with GitHub"}
              </button>
            )}

            {!isResetMode && (
              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-outline-variant/20" />
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-semibold">
                  or email
                </span>
                <div className="h-px flex-1 bg-outline-variant/20" />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1"
                >
                  Work Email
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-surface-container-highest/40 border-0 rounded-xl py-3.5 pl-4 pr-10 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg group-focus-within:text-primary transition-colors">
                    alternate_email
                  </span>
                </div>
              </div>

              {!isResetMode && (
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-container-highest/40 border-0 rounded-xl py-3.5 pl-4 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {isLogin && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsResetMode(true);
                          setError("");
                          setMessage("");
                        }}
                        className="text-xs text-primary/80 hover:text-primary transition-colors"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {message && (
                <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-xl text-sm text-center">
                  {message}
                </div>
              )}

              {error && (
                <p className="text-error text-sm text-center bg-error/10 border border-error/20 py-2 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-button text-on-primary font-bold py-4 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 mt-6 disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : isResetMode
                  ? "Send Reset Link"
                  : isLogin
                  ? "Access Workspace"
                  : "Create Account"}
              </button>

              {isResetMode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(false);
                    setError("");
                    setMessage("");
                  }}
                  className="w-full text-center text-sm text-on-surface-variant hover:text-on-surface transition-colors mt-4"
                >
                  Back to Login
                </button>
              )}
            </form>
          </div>

          {/* Terms */}
          {!isResetMode && (
            <p className="mt-8 text-center text-xs text-on-surface-variant/60 leading-relaxed">
              By continuing, you agree to Archie&apos;s <br />
              <a
                href="#"
                className="text-on-surface-variant hover:text-on-surface underline underline-offset-4 decoration-outline-variant/30"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-on-surface-variant hover:text-on-surface underline underline-offset-4 decoration-outline-variant/30"
              >
                Privacy Policy
              </a>
              .
            </p>
          )}

          {/* Decorative Glow */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
        </div>

        {/* System Status */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest">
              Archie Core 2.4.0 Online
            </span>
          </div>
          <div className="h-4 w-px bg-outline-variant/20" />
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xs text-on-surface-variant/40">
              encrypted
            </span>
            <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest">
              Secure Handshake
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center text-on-surface">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
