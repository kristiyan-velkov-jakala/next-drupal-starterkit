// src/stores/language-store.ts
import { type StoreApi } from "zustand";
import { createStore } from "zustand/vanilla";

export type Translation = {
  label: string;
  path: string;
  langcode: string;
};

type LanguageState = {
  locale: string;
  locales: string[];
  translations: Translation[];
};

type LanguageActions = {
  setLocale: (locale: string) => void;
  setTranslations: (translations: Translation[]) => void;
};

export type LanguageStore = LanguageState & LanguageActions;

export const createLanguageStore = (
  initState: LanguageState,
): StoreApi<LanguageStore> => {
  return createStore<LanguageStore>((set) => ({
    ...initState,
    setLocale: (locale: string) => set({ locale }),
    setTranslations: (translations: Translation[]) => set({ translations }),
  }));
};
