"use client";

import { useEffect } from "react";

export default function ScrollSectionHandler() {
  useEffect(() => {
    const sections = ["home", "projects", "certificates", "courses", "education", "about", "contact"];
    
    const handleScroll = () => {
      const elements = sections.map((id) => document.getElementById(id)).filter(Boolean);
      let currentSection = "home";
      // Trigger when the section reaches the upper-middle region of the viewport
      const scrollPosition = window.scrollY + window.innerHeight * 0.42;

      elements.forEach((el) => {
        if (el.offsetTop <= scrollPosition) {
          currentSection = el.id;
        }
      });

      document.documentElement.setAttribute("data-active-section", currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
