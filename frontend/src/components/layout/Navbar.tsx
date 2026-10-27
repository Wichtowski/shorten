"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import { usePathname } from "next/navigation";

const navCell =
  "flex h-full items-center border-l-rule border-ink px-4 font-bold sm:px-6 hover:bg-ink hover:text-paper";

export const Navbar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isRedirectPage = pathname?.startsWith("/r/");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const cellClass = (href: string, extra = "") =>
    `${navCell} ${pathname === href ? "bg-ink text-paper" : ""} ${extra}`;

  return (
    <nav className="band sticky top-0 z-40 bg-paper">
      <div className="flex h-14 items-stretch justify-between sm:h-16">
        <Link href="/" className="display flex items-center px-4 text-3xl sm:px-8 sm:text-4xl">
          shorten
        </Link>
        {mounted && !isRedirectPage && (
          <div className="flex items-stretch">
            {user ? (
              <Link href="/account" className={cellClass("/account")}>
                Your links
              </Link>
            ) : (
              <>
                <Link href="/login" className={cellClass("/login")}>
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className={cellClass("/signup", pathname === "/signup" ? "" : "bg-signal")}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
