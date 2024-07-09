import "@/styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { HeaderNav } from "@/components/header/HeaderNav";
import { DraftAlert } from "@/components/misc/DraftAlert";
import { LanguageStoreProvider } from "@/components/providers/LanguageStoreProvider";
import { drupal } from "@/lib/drupal/drupal";

import { i18n } from "@/next-i18next.config";

export const metadata: Metadata = {
  title: {
    default: "Next.js for Drupal",
    template: "%s | Next.js for Drupal",
  },
  description: "A Next.js site powered by a Drupal backend.",
  icons: {
    icon: "/favicon.ico",
  },
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string[] };
}) {
  const [locale, ...pathParts] = slug;

  const path = `/${pathParts.join("/")}`;
  console.log("Language Code:", locale);
  console.log("Path:", path);
  console.log("slug:", slug);

  // console.log(slug, path);
  const { items } = await drupal.getMenu("main", {
    defaultLocale: "en-US",
    locale: locale,
  });

  // const article = getData(
  //   `/articles/nextjs-kayttokokemuksen-parantaminen-suorituskyvyn-optimoinnin-avulla`,
  // );
  // const data = await drupal.getResourceByPath(
  //   `/articles/nextjs-kayttokokemuksen-parantaminen-suorituskyvyn-optimoinnin-avulla`,
  //   {
  //     defaultLocale: "en-US",
  //     locale: "fi",
  //   },
  // );

  const data = await drupal.getResourceByPath(path, {
    defaultLocale: "en",
    locale: locale,
  });

  // const translatedPath = await drupal.translatePath(path);
  // console.log(data);

  // const term = await drupal.getResource<DrupalTaxonomyTerm>(
  //   "taxonomy_term--tags",
  //   "66061d40-9ad2-4d73-88e8-847d559740fe",
  // );
  // console.log(term);
  return (
    <>
      <LanguageStoreProvider
        translations={data["content_translations"]}
        initialLocale={locale}
      >
        <DraftAlert />
        <div className="max-w-screen-md px-6 mx-auto">
          <HeaderNav items={items} />
          <main className="container py-10 mx-auto">
            <h1 className="mb-2 text-6xl font-black leading-6">
              Latest Articles.
              <br />
              <small className="text-xl">
                <em>Using the App Router</em>
              </small>
            </h1>
            {children}
          </main>
        </div>
      </LanguageStoreProvider>
    </>
  );
}
