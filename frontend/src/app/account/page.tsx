"use client";

import { useEffect, useState } from "react";
import { useUser } from "@components/context/UserContext";
import { useRouter } from "next/navigation";
import { Notification } from "@components/common/Notification";
import { ConfirmationOverlay } from "@components/common/ConfirmationOverlay";
import { Spinner } from "@components/common/Spinner";
import { useUrls } from "@hooks/useUrls";
import { useDeleteUrl } from "@hooks/useDeleteUrl";
import { useDeleteAccount } from "@hooks/useDeleteAccount";
import { Url } from "@shared/url";
import { apiClient } from "@lib/api-client";
import { tokenToUser } from "@lib/auth";
import { formatShortUrl } from "@utils/shortUrl";
import { UrlTable } from "@components/account/UrlTable";
import Link from "next/link";

interface ShortenedUrl {
  originalUrl: string;
  shortUrl: string;
  timestamp: number;
}

export default function MyUrlsPage() {
  const { user, logout } = useUser();
  const router = useRouter();
  const { urls: localUrls = [], error, loading } = useUrls();
  const { deleteUrl, deleteLoading } = useDeleteUrl();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    urlId: string | null;
  }>({
    isOpen: false,
    urlId: null
  });
  const [deleteAccountConfirmation, setDeleteAccountConfirmation] = useState<boolean>(false);
  const { deleteAccount } = useDeleteAccount();
  const [syncedUrls, setSyncedUrls] = useState<Url[]>([]);
  const [shouldUseLocal, setShouldUseLocal] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const decoded = tokenToUser(token);
      if (!decoded) {
        router.push("/login");
        return;
      }
    };

    checkAuth();
  }, [user, router]);

  useEffect(() => {
    const syncData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const storedUrls = JSON.parse(localStorage.getItem("urls") || "[]");
      const recentShortens = JSON.parse(localStorage.getItem("recent_shortens") || "[]");

      try {
        const data = await apiClient.getUrls(token);
        const serverUrls = data.urls;

        // MIGRATE IF RECENT SHORTENS ARE NOT IN THE SERVER
        if (recentShortens.length > 0) {
          const missing = recentShortens.filter(
            (r: ShortenedUrl) => !serverUrls.some((u: Url) => u.short_url === r.shortUrl)
          );
          if (missing.length > 0) {
            await apiClient.migrateShortens(missing, token);
            localStorage.removeItem("recent_shortens");
            // Odśwież dane po migracji
            const refreshedData = await apiClient.getUrls(token);
            localStorage.setItem("urls", JSON.stringify(refreshedData.urls));
            setSyncedUrls(refreshedData.urls);
            setShouldUseLocal(false);
            setNotification({
              message: "Links you made before signing in were added to your account.",
              type: "success"
            });
            setIsInitialLoad(false);
            return;
          }
        }

        // Only update if there's a real difference in data
        const isDataMatching =
          storedUrls.length === serverUrls.length &&
          storedUrls.every((storedUrl: Url, index: number) => {
            const serverUrl = serverUrls[index];
            return (
              storedUrl.clicks === serverUrl.clicks &&
              storedUrl.original_url === serverUrl.original_url &&
              storedUrl.short_url === serverUrl.short_url
            );
          });

        if (!isDataMatching) {
          localStorage.setItem("urls", JSON.stringify(serverUrls));
          setSyncedUrls(serverUrls);
          setShouldUseLocal(false);
        }
      } catch (err) {
        console.error("Error syncing URLs:", err);
        setNotification({
          message: "Couldn't load your links. Refresh to try again.",
          type: "error"
        });
      } finally {
        setIsInitialLoad(false);
      }
    };

    syncData();
  }, []);

  const handleCopyOriginalUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setNotification({ message: "Original link copied", type: "success" });
  };

  const handleCopyShortUrl = (slug: string) => {
    navigator.clipboard.writeText(formatShortUrl(slug));
    setNotification({ message: "Link copied", type: "success" });
  };

  const handleDeleteClick = (urlId: string) => {
    setDeleteConfirmation({ isOpen: true, urlId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.urlId) return;

    try {
      await deleteUrl(deleteConfirmation.urlId);
      setSyncedUrls((urls) => urls.filter((url) => url.id !== deleteConfirmation.urlId));
      setNotification({ message: "Link deleted", type: "success" });
    } catch (err) {
      setNotification({
        message: err instanceof Error ? err.message : "Couldn't delete that link",
        type: "error"
      });
    } finally {
      setDeleteConfirmation({ isOpen: false, urlId: null });
    }
  };

  const handleDeleteAccountClick = () => {
    setDeleteAccountConfirmation(true);
  };

  const handleDeleteAccountConfirm = async () => {
    try {
      await deleteAccount();
      setNotification({ message: "Account deleted", type: "success" });
    } catch (err) {
      console.error("Error deleting account:", err);
      setNotification({
        message: err instanceof Error ? err.message : "Failed to delete account",
        type: "error"
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  // Use local URLs by default, only switch to server data if they don't match
  const displayUrls = shouldUseLocal ? localUrls : syncedUrls;
  const totalClicks = displayUrls.reduce((sum, url) => sum + url.clicks, 0);

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <ConfirmationOverlay
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, urlId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete link?"
        message="The short link will stop working right away. This can't be undone."
        confirmText="Delete link"
      />
      <ConfirmationOverlay
        isOpen={deleteAccountConfirmation}
        onClose={() => setDeleteAccountConfirmation(false)}
        onConfirm={handleDeleteAccountConfirm}
        title="Delete account?"
        message="Your account and every short link you made will be removed. This can't be undone."
        confirmText="Delete account"
      />

      <section className="band">
        <div className="frame flex flex-col gap-6 py-10 sm:py-14 md:flex-row md:items-end md:justify-between">
          <h1 className="display text-[clamp(4rem,13vw,12rem)]">Your links</h1>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="font-bold">{user.username || user.email}</p>
            <div className="flex gap-3">
              <button onClick={() => router.push("/")} className="btn btn-signal">
                New link
              </button>
              <button onClick={handleLogout} className="btn">
                Log out
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="band">
        <dl className="frame grid grid-cols-2">
          <div className="border-r-rule border-ink py-6 pr-4">
            <dt className="font-bold">Links</dt>
            <dd className="display mt-2 text-7xl sm:text-8xl">{displayUrls.length}</dd>
          </div>
          <div className="py-6 pl-4 sm:pl-8">
            <dt className="font-bold">Clicks</dt>
            <dd className="display mt-2 text-7xl sm:text-8xl">{totalClicks}</dd>
          </div>
        </dl>
      </section>

      <section className="band">
        <div className="frame py-8 sm:py-10">
          {isInitialLoad || loading ? (
            <Spinner />
          ) : error ? (
            <p role="alert" className="border-rule border-ink bg-alarm px-4 py-3 font-bold">
              {error}
            </p>
          ) : displayUrls.length === 0 ? (
            <p className="text-lg leading-7">
              You haven&apos;t made any links yet.{" "}
              <Link href="/" className="text-link">
                Shorten your first one
              </Link>
            </p>
          ) : (
            <UrlTable
              urls={displayUrls}
              onCopyOriginalUrl={handleCopyOriginalUrl}
              onCopyShortUrl={handleCopyShortUrl}
              onDeleteUrl={handleDeleteClick}
              deleteLoading={deleteLoading}
            />
          )}
        </div>
      </section>

      <section className="band">
        <div className="frame flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl leading-6">
            Deleting your account removes it and every short link you made.
          </p>
          <button onClick={handleDeleteAccountClick} className="btn btn-alarm">
            Delete account
          </button>
        </div>
      </section>
    </>
  );
}
