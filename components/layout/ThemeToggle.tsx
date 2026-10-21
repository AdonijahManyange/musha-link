"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read the user's saved preference.
    const savedTheme = localStorage.getItem("mushalink-theme");

    // Otherwise, respect their device's theme preference.
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme: Theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : prefersDark
          ? "dark"
          : "light";

    document.documentElement.classList.toggle(
        "dark",
        initialTheme === "dark"
    );

    document.documentElement.style.colorScheme = initialTheme;

    setTheme(initialTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    // Apply the selected theme to the entire document.
    document.documentElement.classList.toggle(
        "dark",
        nextTheme === "dark"
    );

    // Update the global background and text colors immediately.
    document.documentElement.style.colorScheme = nextTheme;

    // Save the user's preference.
    localStorage.setItem("mushalink-theme", nextTheme);

    // Update the button icon.
    setTheme(nextTheme);

    console.log("MushaLink theme:", nextTheme);
    }

  // Avoid rendering different icons before hydration.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle color theme"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600"
        disabled
      >
        <Sun size={20} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-yellow-300 dark:hover:bg-slate-700"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}