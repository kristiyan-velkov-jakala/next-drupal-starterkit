import { DrupalMenuItem } from "next-drupal";

import { LanguageSwitcher } from "@/components/header/language-switcher";
import { Link } from "@/components/header/Link";
import NavigationMenu from "@/components/header/NavigationMenu";

type Props = {
  items: DrupalMenuItem[];
};

export function HeaderNav({ items }: Props) {
  return (
    <header>
      <div className="container flex items-center justify-between py-6 mx-auto">
        <Link href="/" className="text-2xl font-semibold no-underline">
          Next.js for Drupal
        </Link>
        <NavigationMenu menuLinks={items} />
        <LanguageSwitcher />
        <Link
          href="https://next-drupal.org/docs"
          target="_blank"
          rel="external"
          className="hover:text-blue-600"
        >
          Read the docs
        </Link>
        {/*<LanguageSwitcher />*/}
      </div>
    </header>
  );
}
