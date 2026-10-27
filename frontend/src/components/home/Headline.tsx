"use client";

import { useEffect, useRef, useState } from "react";

export const Headline = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rowRef = useRef<HTMLSpanElement>(null);
  const osRef = useRef<HTMLSpanElement>(null);
  const [os, setOs] = useState(2);

  // Stretch "long" with as many o's as fit on the first row
  useEffect(() => {
    const heading = headingRef.current;
    const row = rowRef.current;
    const stretch = osRef.current;
    if (!heading || !row || !stretch) {
      return;
    }

    const fit = () => {
      const style = getComputedStyle(heading);
      const available =
        heading.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      setOs((current) => {
        const oWidth = stretch.getBoundingClientRect().width / current;
        const spare = available - row.getBoundingClientRect().width;
        return Math.max(1, current + Math.floor(spare / oWidth));
      });
    };

    const observer = new ResizeObserver(fit);
    observer.observe(heading);
    document.fonts.ready.then(fit);

    return () => observer.disconnect();
  }, []);

  return (
    <h1
      ref={headingRef}
      aria-label="Make long links short."
      className="frame display py-10 text-[clamp(4rem,15vw,15rem)] sm:py-14"
    >
      <span ref={rowRef} className="inline-block whitespace-nowrap">
        Make l<span ref={osRef}>{"o".repeat(os)}</span>ng
      </span>
      <br />
      links <span className="tracking-[-0.05em]">short.</span>
    </h1>
  );
};
