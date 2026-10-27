"use client";

import { useState } from "react";
import { apiClient } from "@lib/api-client";
import { useUser } from "@components/context/UserContext";
import { AuthFrame } from "@components/auth/AuthFrame";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!username) {
      setError("Username is required");
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient.signup({
        email,
        username,
        password
      });

      localStorage.setItem("token", data.token);
      setUser(data.user);
      window.location.assign("/");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      title="Sign up"
      footerQuestion="Already have an account?"
      footerLinkHref="/login"
      footerLinkText="Log in"
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
          <label htmlFor="username" className="field-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="field"
            placeholder="your-handle"
            autoComplete="username"
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
            autoComplete="new-password"
            suppressHydrationWarning
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="field-label">
            Confirm password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="field"
            placeholder="••••••••"
            autoComplete="new-password"
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
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthFrame>
  );
}
