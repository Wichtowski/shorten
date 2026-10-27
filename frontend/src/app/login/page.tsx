"use client";

import { useState } from "react";
import { useUser } from "@components/context/UserContext";
import { apiClient } from "@lib/api-client";
import { AuthFrame } from "@components/auth/AuthFrame";

export default function LoginPage() {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiClient.login({ email, password });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", String(data.token));
        setUser(data.user);

        const recentShortens = JSON.parse(localStorage.getItem("recent_shortens") || "[]");
        if (recentShortens.length > 0) {
          await apiClient.migrateShortens(recentShortens, data.token);
          localStorage.removeItem("recent_shortens");
        }
      }

      window.location.assign("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      title="Log in"
      footerQuestion="Need an account?"
      footerLinkHref="/signup"
      footerLinkText="Sign up"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="field-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="name@company.com"
            autoComplete="email"
            suppressHydrationWarning
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            placeholder="••••••••"
            autoComplete="current-password"
            suppressHydrationWarning
            required
          />
        </div>

        {error && (
          <p role="alert" className="border-rule border-ink bg-alarm px-4 py-3 font-bold">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn btn-signal w-full py-4 text-lg">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthFrame>
  );
}
