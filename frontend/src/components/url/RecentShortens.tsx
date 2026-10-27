import React from "react";

interface ShortenedUrl {
  originalUrl: string;
  shortUrl: string;
  timestamp: number;
}

interface RecentShortensProps {
  recentShortens: ShortenedUrl[];
  onClear: () => void;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });

export const RecentShortens = ({ recentShortens, onClear }: RecentShortensProps) => {
  if (recentShortens.length === 0) {
    return null;
  }

  return (
    <section className="band">
      <div className="frame py-8 sm:py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="display text-5xl sm:text-6xl">Recent</h2>
          <button onClick={onClear} className="btn btn-small">
            Clear history
          </button>
        </div>
        <ul className="border-t-rule border-ink">
          {recentShortens.map((shorten) => (
            <li
              key={`${shorten.shortUrl}-${shorten.timestamp}`}
              className="grid gap-1 border-b-rule border-ink py-3 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
            >
              <a
                href={`/r/${shorten.shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="url truncate text-lg font-bold underline decoration-[3px] underline-offset-4 hover:bg-signal"
              >
                /r/{shorten.shortUrl}
              </a>
              <span className="url truncate text-sm">{shorten.originalUrl}</span>
              <span className="text-sm">{dateFormatter.format(new Date(shorten.timestamp))}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
