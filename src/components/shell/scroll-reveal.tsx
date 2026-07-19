"use client";

import { useEffect } from "react";

/*
  Progressive-enhancement scroll reveal. Sections marked `.reveal` are visible by
  default (works with no JS). On mount we "arm" them (hide) and reveal each once as
  it scrolls into view, so revealed content never flickers back out.
*/
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      // Already on screen at load: reveal immediately without the hidden step.
      if (rect.top < window.innerHeight * 0.92) {
        element.classList.add("reveal-armed", "reveal-in");
        continue;
      }
      element.classList.add("reveal-armed");
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
