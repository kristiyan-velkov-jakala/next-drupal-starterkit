import { usePathname } from "next/navigation"; // New router hook
import { useEffect } from "react";

import { useLanguageStore } from "@/hooks/useLanguageStore";

export const useLanguageFromPath = () => {
  const pathname = usePathname(); // Get the current path
  const setLocale = useLanguageStore((state) => state.setLocale);

  useEffect(() => {
    const matchLocaleFromPath = () => {
      // Get the first part of the path
      const path = pathname.split("/")[1];
      // Default to 'en' if no path
      const possibleLocale = path || "en";

      setLocale(possibleLocale);
    };

    matchLocaleFromPath();
  }, [pathname, setLocale]);
};
