import "@/styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

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
  params,
}: {
  children: ReactNode;
  params: { lang: string[] };
}) {
  // const headersList = headers();
  // const host = headersList.get("host");
  // console.log(params);
  // const { items, tree } = await drupal.getMenu("main", {
  //   defaultLocale: "en-US",
  //   locale: lang,
  // });

  return (
    /* <html>
          <LanguageStoreProvider>
            <body>
              <DraftAlert />
              <div className="max-w-screen-md px-6 mx-auto">
                {/!*<HeaderNav items={items} />*!/}
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
            </body>
          </LanguageStoreProvider>
        </html>*/
    <html>
      <body>
        {/*<LanguageStoreProvider>*/}
        {children}
        {/*</LanguageStoreProvider>*/}
      </body>
    </html>
  );
}
