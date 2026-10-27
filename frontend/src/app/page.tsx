"use client";
import React from "react";
import { Headline } from "@components/home/Headline";
import { UrlShortener } from "@components/url/UrlShortener";

export default function HomePage() {
  return (
    <>
      <section className="band">
        <Headline />
      </section>
      <UrlShortener />
    </>
  );
}
