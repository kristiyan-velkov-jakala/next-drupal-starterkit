import { drupal } from "@/lib/drupal/drupal";

export const getData = async (path: string) => {
  const data = await drupal.getResourceByPath(path, {
    defaultLocale: "en",
    locale: "fi",
  });

  return data;
};
