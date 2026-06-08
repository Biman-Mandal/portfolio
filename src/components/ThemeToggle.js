"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    const pref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const currentTheme = saved || pref;
    setTheme(currentTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  if (!mounted) {
    return <div style={{ width: 42, height: 42 }} />;
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="btn theme-toggle-btn"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        width: 42,
        height: 42,
        padding: 0,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <span
        style={{
          display: "inline-flex",
          transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
          opacity: theme === "dark" ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease",
          position: "absolute"
        }}
      >
        <Moon size={18} />
      </span>
      <span
        style={{
          display: "inline-flex",
          transform: theme === "light" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0)",
          opacity: theme === "light" ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease",
          position: "absolute"
        }}
      >
        <Sun size={18} />
      </span>
    </button>
  );
}
