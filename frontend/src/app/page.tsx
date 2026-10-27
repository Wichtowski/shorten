"use client";
import React from "react";
import { UrlShortener } from "@components/url/UrlShortener";

export default function HomePage() {
  return (
    <>
      <section className="band">
        <h1 className="frame display py-10 text-[clamp(4rem,15vw,15rem)] sm:py-14">
          Make long
          <br />
          links short.
        </h1>
      </section>
      <UrlShortener />
    </>
  );
}
