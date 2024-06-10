"use client";

import { createContext, type ReactNode, useEffect, useRef } from "react";
import { type StoreApi } from "zustand";

import siteConfig from "@/site.config";
import {
  createLanguageStore,
  type LanguageStore,
  type Translation,
} from "@/stores/language-store";

export const LanguageStoreContext =
  createContext<StoreApi<LanguageStore> | null>(null);

export interface LanguageStoreProviderProps {
  children: ReactNode;
  translations: Translation[];
  initialLocale: string;
}

export const LanguageStoreProvider = ({
  children,
  translations,
  initialLocale,
}: LanguageStoreProviderProps) => {
  const storeRef = useRef<StoreApi<LanguageStore>>();
  if (!storeRef.current) {
    storeRef.current = createLanguageStore({
      locale: initialLocale,
      locales: Object.keys(siteConfig.locales),
      translations,
    });
  }

  // Update translations and locale in the store when provided
  useEffect(() => {
    storeRef.current?.getState().setTranslations(translations);
    storeRef.current?.getState().setLocale(initialLocale);
  }, [translations, initialLocale]);

  return (
    <LanguageStoreContext.Provider value={storeRef.current}>
      {children}
    </LanguageStoreContext.Provider>
  );
};
