import { useContext } from "react";
import { useStore } from "zustand";

import { LanguageStoreContext } from "@/components/providers/LanguageStoreProvider";

import { LanguageStore } from "@/stores/language-store";

export const useLanguageStore = <T>(
  selector: (store: LanguageStore) => T,
): T => {
  const languageStoreContext = useContext(LanguageStoreContext);

  if (!languageStoreContext) {
    throw new Error(
      `useLanguageStore must be used within LanguageStoreProvider`,
    );
  }

  return useStore(languageStoreContext, selector);
};
