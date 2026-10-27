"use client";

import React, { useEffect, useState } from "react";
import { canShortenMore, incrementShortenCount } from "@utils/urlUtils";
import { useNotification } from "@components/context/NotificationContext";
import { useUser } from "@components/context/UserContext";
import { useRecentShortens } from "@hooks/useRecentShortens";
import { apiClient } from "@lib/api-client";
import { UrlDetails } from "./UrlDetails";
import { UrlParameters } from "./UrlParameters";
import { RecentShortens } from "./RecentShortens";
import Link from "next/link";

export const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showNotification } = useNotification();
  const { user } = useUser();
  const recent = useRecentShortens();
  const { addShorten } = recent;

  // A submit before hydration falls back to a native GET (/?url=...); recover the link from it
  useEffect(() => {
    const pending = new URLSearchParams(window.location.search).get("url");
    if (!pending) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      window.history.replaceState(null, "", window.location.pathname);
      setUrl(pending);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const validateUrl = async (urlString: string) => {
    try {
      const url = new URL(urlString);
      if (url.protocol !== "https:") {
        throw new Error("That link isn't HTTPS. Use a link that starts with https://");
      }
      return true;
    } catch (error) {
      if (error instanceof Error && !(error instanceof TypeError)) {
        setError(error.message);
      } else {
        setError("That doesn't look like a link. Paste a full address starting with https://");
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Read from the form, not state: a link pasted before hydration never reaches state
    const url = String(new FormData(e.currentTarget).get("url") ?? "").trim();
    setUrl(url);
    setError("");
    setLoading(true);

    if (!canShortenMore()) {
      showNotification("You've used your 3 free links. Sign up to make more.", "info");
      setLoading(false);
      return;
    }

    if (!(await validateUrl(url))) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.shortenUrl(
        {
          originalUrl: url
        },
        token || undefined
      );
      const generatedShortUrl = response.url.short_url;
      setShortUrl(generatedShortUrl);
      // Add to recent shortenings immediately after shortening
      addShorten(url, generatedShortUrl);
      incrementShortenCount();
      showNotification("Link shortened", "success");
    } catch (error) {
      console.error("Error shortening URL:", error);
      setError(error instanceof Error ? error.message : "Failed to shorten URL");
      showNotification("Couldn't shorten that link", "error");
    }
    setLoading(false);
  };

  return (
    <>
      <section className="band">
        <form onSubmit={handleSubmit} id="shorten" className="frame py-8 sm:py-10">
          <label htmlFor="url" className="field-label text-base">
            Long link
          </label>
          <div className="flex flex-col sm:flex-row">
            <input
              type="url"
              id="url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="field url min-w-0 flex-1 py-4 text-lg sm:text-xl"
              placeholder="https://"
              aria-describedby="url-hint"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-signal -mt-[3px] px-10 py-4 text-xl sm:-ml-[3px] sm:mt-0"
            >
              {loading ? "Shortening…" : "Shorten"}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-4 border-rule border-ink bg-alarm px-4 py-3 font-bold">
              {error}
            </p>
          )}

          <p id="url-hint" className="mt-4 max-w-2xl leading-6">
            HTTPS links only.{" "}
            {user ? (
              "Your links are saved to your account."
            ) : (
              <>
                Without an account you can make 3 links.{" "}
                <Link href="/signup" className="text-link">
                  Sign up
                </Link>{" "}
                for unlimited links and click counts.
              </>
            )}
          </p>
        </form>
      </section>

      {shortUrl && (
        <>
          <UrlDetails shortUrl={shortUrl} originalUrl={url} />
          {user && <UrlParameters originalUrl={url} />}
        </>
      )}

      <RecentShortens recentShortens={recent.recentShortens} onClear={recent.clearRecentShortens} />
    </>
  );
};
