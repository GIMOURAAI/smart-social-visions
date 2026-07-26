import { useEffect } from "react";
import "./premium-motion.css";
import "./mobile-touch-hero-fix.css";

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
        (element as HTMLElement).style.setProperty("--motion-delay", `${Math.min(index * 25, 150)}ms`);
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
      { threshold: 0.1, rootMargin: "0px 0px -4% 0px" },
    );

    observed.forEach((element) => observer.observe(element));

    const heroElements = document.querySelectorAll(
      ".axis-menu, .axis-avatar, .axis-side-copy, .axis-brand, .axis-bottom-cta",
    );
    heroElements.forEach((element, index) => {
      element.classList.add("motion-hero-entry");
      (element as HTMLElement).style.setProperty("--motion-delay", `${60 + index * 55}ms`);
    });
    const heroFrame = requestAnimationFrame(() => {
      heroElements.forEach((element) => element.classList.add("motion-visible"));
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(heroFrame);
    };
  }, []);

  return null;
}
