"use client";

import { useEffect } from "react";

export default function ScrollSectionHandler() {
  useEffect(() => {
    const sections = ["home", "projects", "certificates", "courses", "education", "about", "contact"];
    
    // 1. IntersectionObserver for active section (navbar highlighting)
    const activeObserverOptions = {
      root: null,
      rootMargin: "-25% 0px -45% 0px", // Focus on the middle of the viewport
      threshold: 0
    };

    const activeObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.documentElement.setAttribute("data-active-section", entry.target.id);
        }
      });
    };

    const activeObserver = new IntersectionObserver(activeObserverCallback, activeObserverOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) activeObserver.observe(el);
    });

    // 2. IntersectionObserver for one-time scroll entrance reveal animations
    const revealObserverOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px", // Trigger when element is slightly visible
      threshold: 0.02
    };

    const revealObserverCallback = (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          // Stop observing this element once revealed (one-time animation)
          observerInstance.unobserve(entry.target);
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) revealObserver.observe(el);
    });

    // 3. High-performance scroll percentage tracker with cached dimensions
    let viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    let documentHeight = typeof document !== "undefined" ? document.documentElement.scrollHeight : 0;
    let maxScroll = documentHeight - viewportHeight;

    const handleResize = () => {
      viewportHeight = window.innerHeight;
      documentHeight = document.documentElement.scrollHeight;
      maxScroll = documentHeight - viewportHeight;
    };

    const handleScroll = () => {
      if (maxScroll > 0) {
        const percent = window.scrollY / maxScroll;
        document.documentElement.style.setProperty("--scroll-percent", percent);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial calls
    handleScroll();

    return () => {
      activeObserver.disconnect();
      revealObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
