"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  // Validate the session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        // If there's no active session, they cannot reset the password this way
        router.replace("/auth?error=unauthorized_reset");
      } else {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [supabase.auth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setMessage("Password updated successfully. Please login with your new password.");
      
      // Optionally sign out the user so they have to login with the new password
      await supabase.auth.signOut();
      
      // Give them a moment to read the success message before redirecting
      setTimeout(() => {
        router.push("/auth?tab=login");
      }, 3000);
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="text-sm tracking-widest uppercase opacity-70">Verifying secure link...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-background min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-tertiary-container/5 rounded-full blur-[100px] -z-10" />

      {/* Auth Card */}
      <main className="w-full max-w-md">
        <div className="glass-panel ghost-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
          
          <div className="mb-8 text-center">
            <h1 className="font-extrabold text-2xl tracking-tighter text-slate-50 mb-2">
              Reset Password
            </h1>
            <p className="text-sm text-on-surface-variant">
              Enter a new secure password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                New Password
              </label>
              <div className="relative group">
                <input
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
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-highest/40 border-0 rounded-xl py-3.5 pl-4 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
            </div>

            {message && (
              <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-xl text-sm text-center">
                {message}
              </div>
            )}

            {error && (
              <p className="text-error text-sm text-center bg-error/10 border border-error/20 py-2 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !!message}
              className="w-full gradient-button text-on-primary font-bold py-4 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}
