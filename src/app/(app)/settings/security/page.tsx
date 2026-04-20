"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("No authenticated user found.");

      // Verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect.");
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setMessage("Password successfully updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-on-surface mb-2">Security</h1>
      <p className="text-on-surface-variant mb-8">Manage your account security and authentication methods.</p>

      <div className="glass-panel ghost-border rounded-2xl p-8 space-y-6">
        <form onSubmit={handleChangePassword}>
          <h3 className="text-xl font-bold text-on-surface mb-1">Change Password</h3>
          <p className="text-sm text-on-surface-variant mb-6">Update your password to keep your account secure.</p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-surface-container-highest/40 border-0 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-surface-container-highest/40 border-0 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-surface-container-highest/40 border-0 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          {message && (
            <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-xl text-sm mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="gradient-button px-6 py-2.5 rounded-xl text-on-primary font-semibold text-sm disabled:opacity-50 transition-opacity"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        
        <div className="h-px bg-outline-variant/20 my-6" />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-1">Two-Factor Authentication</h3>
              <p className="text-sm text-on-surface-variant">Add an extra layer of security to your account.</p>
            </div>
            <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
          <button disabled className="border border-outline-variant/30 bg-surface-container/50 px-6 py-2.5 rounded-xl text-on-surface-variant font-semibold text-sm opacity-60 cursor-not-allowed">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );
}
