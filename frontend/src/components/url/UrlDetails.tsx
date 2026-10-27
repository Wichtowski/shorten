import React from "react";
import { useNotification } from "@components/context/NotificationContext";
import { CopyButton } from "@components/common/CopyButton";
import { formatShortUrl } from "@utils/shortUrl";

interface UrlDetailsProps {
  shortUrl: string;
  originalUrl: string;
}

export const UrlDetails = ({ shortUrl, originalUrl }: UrlDetailsProps) => {
  const { showNotification } = useNotification();
  const fullShortUrl = formatShortUrl(shortUrl);
  const displayUrl = fullShortUrl.replace(/^https?:\/\//, "");
  // Wrap between host and path so the slug never splits across lines
  const pathStart = displayUrl.indexOf("/");
  const host = pathStart === -1 ? displayUrl : displayUrl.slice(0, pathStart);
  const path = pathStart === -1 ? "" : displayUrl.slice(pathStart);

  return (
    <section className="band bg-signal" aria-live="polite">
      <div className="frame py-8 sm:py-12">
        <p className="font-bold">Your short link</p>
        <p className="display mt-3 text-[clamp(2.75rem,9vw,9rem)] [overflow-wrap:anywhere]">
          {host}
          <wbr />
          {path}
        </p>
        <p className="mt-6 max-w-3xl break-all leading-6">
          Goes to <span className="url">{originalUrl}</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <CopyButton
            value={fullShortUrl}
            onCopied={() => showNotification("Link copied", "success")}
            className="btn bg-ink px-8 text-lg text-paper"
          >
            Copy link
          </CopyButton>
          <a href={fullShortUrl} target="_blank" rel="noopener noreferrer" className="btn text-lg">
            Open
          </a>
        </div>
      </div>
    </section>
  );
};
