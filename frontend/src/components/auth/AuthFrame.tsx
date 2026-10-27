import React from "react";
import Link from "next/link";

interface AuthFrameProps {
  title: string;
  footerQuestion: string;
  footerLinkHref: string;
  footerLinkText: string;
  children: React.ReactNode;
}

export function AuthFrame({
  title,
  footerQuestion,
  footerLinkHref,
  footerLinkText,
  children
}: AuthFrameProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] md:grid-cols-2">
      <section className="band flex flex-col justify-end bg-signal px-4 py-10 sm:px-8 md:border-b-0 md:border-r-rule md:border-ink">
        <h1 className="display text-[clamp(4.5rem,13vw,12rem)]">{title}</h1>
      </section>
      <section className="flex flex-col justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {children}
          <p className="mt-8">
            {footerQuestion}{" "}
            <Link href={footerLinkHref} className="text-link">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
