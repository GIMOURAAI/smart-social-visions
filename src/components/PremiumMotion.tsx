import { useEffect } from "react";
import "./premium-motion.css";

const revealGroups = [
  ".axis-section-head",
  ".axis-new-project",
  ".axis-statement > *",
  ".axis-pricing-intro > *",
  ".axis-footer > *",
];

const staggerGroups = [
  ".axis-horizontal-scroll .axis-app-card",
  ".axis-explore-grid img",
  ".axis-price-grid .axis-price-card",
];

export default function PremiumMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const observed: Element[] = [];

    revealGroups.forEach((selector, groupIndex) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add("motion-reveal");
        element.classList.add((groupIndex + index) % 2 === 0 ? "motion-from-left" : "motion-from-right");
        observed.push(element);
      });
    });

    staggerGroups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add("motion-reveal", index % 2 === 0 ? "motion-from-left" : "motion-from-right");
        (element as HTMLElement).style.setProperty("--motion-delay", `${Math.min(index * 55, 330)}ms`);
        observed.push(element);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    observed.forEach((element) => observer.observe(element));

    const heroElements = document.querySelectorAll(
      ".axis-menu, .axis-avatar, .axis-side-copy, .axis-brand, .axis-bottom-cta",
    );
    heroElements.forEach((element, index) => {
      element.classList.add("motion-hero-entry");
      (element as HTMLElement).style.setProperty("--motion-delay", `${80 + index * 80}ms`);
    });
    const heroFrame = requestAnimationFrame(() => {
      heroElements.forEach((element) => element.classList.add("motion-visible"));
    });

    const rail = document.querySelector<HTMLElement>(".axis-horizontal-scroll");
    let railTimer: number | undefined;
    let direction = 1;

    if (rail) {
      const moveRail = () => {
        const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 12;
        const atStart = rail.scrollLeft <= 12;
        if (atEnd) direction = -1;
        if (atStart) direction = 1;
        rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.72, 390), behavior: "smooth" });
      };

      const startRail = () => {
        if (!railTimer) railTimer = window.setInterval(moveRail, 2100);
      };
      const stopRail = () => {
        if (railTimer) window.clearInterval(railTimer);
        railTimer = undefined;
      };

      startRail();
      rail.addEventListener("pointerenter", stopRail);
      rail.addEventListener("pointerleave", startRail);
      rail.addEventListener("touchstart", stopRail, { passive: true });

      return () => {
        observer.disconnect();
        cancelAnimationFrame(heroFrame);
        stopRail();
        rail.removeEventListener("pointerenter", stopRail);
        rail.removeEventListener("pointerleave", startRail);
        rail.removeEventListener("touchstart", stopRail);
      };
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(heroFrame);
    };
  }, []);

  return null;
}
