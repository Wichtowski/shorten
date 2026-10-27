"use client";
import { useEffect, useState } from "react";
import { Spinner } from "@components/common/Spinner";
import { use } from "react";
import { apiClient } from "@lib/api-client";
import Link from "next/link";

interface PageParams {
  slug: string;
}

export default function RedirectPage({ params }: { params: Promise<PageParams> }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = use(params);

  useEffect(() => {
    const fetchUrl = async () => {
      if (!slug) {
        console.error("No slug provided");
        setError("Invalid URL");
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiClient.resolveShortUrl(slug);
        window.location.href = data.original_url || data.url.original_url;
      } catch (error) {
        console.error("Error fetching URL:", error);
        setError(error instanceof Error ? error.message : "URL not found or invalid");
        // setTimeout(() => router.push('/'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrl();
  }, [slug]);

  if (error) {
    return (
      <section className="frame py-14">
        <h1 className="display text-[clamp(4rem,14vw,12rem)]">Dead link.</h1>
        <p className="mt-6 max-w-xl text-lg leading-7">
          <span className="url font-bold">/r/{slug}</span> doesn&apos;t point anywhere. It may have
          been deleted.
        </p>
        <Link href="/" className="btn btn-signal mt-8 text-lg">
          Make a new short link
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="frame flex items-center gap-4 py-14">
        <Spinner />
        <p className="text-lg font-bold">Redirecting…</p>
      </section>
    );
  }

  return null;
}
