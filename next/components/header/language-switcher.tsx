"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";

import { useOnClickOutside } from "@/lib/hooks/use-on-click-outside";
import LanguageIcon from "@/styles/icons/language.svg";

import { useLanguageFromPath } from "@/hooks/useLanguageFromPath";
import { useLanguageStore } from "@/hooks/useLanguageStore";
import siteConfig from "@/site.config"; // Ensure the path is correct

export function LanguageSwitcher() {
  const locale = useLanguageStore((state) => state.locale);
  const locales = useLanguageStore((state) => state.locales);
  const translations = useLanguageStore((state) => state.translations);

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useLanguageFromPath(); // Ensure language matches URL

  // Close on locale change
  useEffect(close, [locale]);

  // Close on click outside
  const ref = useOnClickOutside<HTMLDivElement>(close);

  return (
    <div ref={ref}>
      <button
        type="button"
        className="hover:underline"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span className="sr-only sm:not-sr-only sm:mr-2 sm:inline">
          {siteConfig.locales[locale]?.name || "Language"}
        </span>
        <LanguageIcon className="inline-block h-6 w-6" aria-hidden="true" />
      </button>
      <ul
        className={clsx(
          "absolute z-50 mt-1 w-fit border border-finnishwinter bg-mischka",
          !isOpen && "hidden",
        )}
      >
        {locales
          .filter((l) => l !== locale)
          .map((l) => {
            // Find the translation for the current language code
            const translation = translations.find((t) => t.langcode === l);

            // Use the language name from the siteConfig
            const languageName = siteConfig.locales[l].name;

            return (
              <li key={l}>
                <Link
                  className="block p-2 hover:bg-primary-50"
                  href={translation?.path || "/"} // Link to the translation path
                  locale={l} // This ensures locale handling if required by Next.js
                  onClick={() => setIsOpen(false)}
                >
                  {languageName} {/* Display the language name */}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
