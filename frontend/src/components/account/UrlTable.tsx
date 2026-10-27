import { Url } from "@shared/url";

interface UrlTableProps {
  urls: Url[];
  onCopyOriginalUrl: (url: string) => void;
  onCopyShortUrl: (slug: string) => void;
  onDeleteUrl: (urlId: string) => void;
  deleteLoading?: string | null;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric"
});

const columns =
  "md:grid md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_5rem_8rem_auto] md:items-center md:gap-6";

export function UrlTable({
  urls = [],
  onCopyOriginalUrl,
  onCopyShortUrl,
  onDeleteUrl,
  deleteLoading
}: UrlTableProps) {
  return (
    <div className="border-t-rule border-ink">
      <div className={`hidden border-b-rule border-ink py-2 text-sm font-bold ${columns}`}>
        <span>Short link</span>
        <span>Goes to</span>
        <span className="text-right">Clicks</span>
        <span>Created</span>
        <span className="sr-only">Actions</span>
      </div>
      <ul>
        {urls.map((url) => (
          <li key={url.id} className={`border-b-rule border-ink py-4 md:py-3 ${columns}`}>
            <a
              href={`/r/${url.short_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="url block truncate text-lg font-bold underline decoration-[3px] underline-offset-4 hover:bg-signal"
            >
              /r/{url.short_url}
            </a>
            <span className="url mt-1 block truncate text-sm md:mt-0" title={url.original_url}>
              {url.original_url}
            </span>
            <span className="mt-2 inline-block text-sm md:mt-0 md:text-right md:text-2xl md:font-black">
              {url.clicks}
              <span className="whitespace-pre md:sr-only"> clicks · </span>
            </span>
            <span className="text-sm">{dateFormatter.format(new Date(url.created_at))}</span>
            <div className="mt-3 flex flex-wrap gap-2 md:mt-0 md:justify-end">
              <button onClick={() => onCopyShortUrl(url.short_url)} className="btn btn-small">
                Copy
              </button>
              <button
                onClick={() => onCopyOriginalUrl(url.original_url)}
                className="btn btn-small"
                aria-label={`Copy original link for /r/${url.short_url}`}
              >
                Copy original
              </button>
              <button
                onClick={() => onDeleteUrl(url.id)}
                disabled={deleteLoading === url.id}
                className="btn btn-small btn-alarm"
              >
                {deleteLoading === url.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
