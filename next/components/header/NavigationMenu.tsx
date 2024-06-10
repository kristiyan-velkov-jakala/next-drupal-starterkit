import Link from "next/link";
import { DrupalMenuItem } from "next-drupal";
import React from "react";

type MenuLink = {
  type: string;
  id: string;
  description: string | null;
  enabled: boolean;
  expanded: boolean;
  menu_name: string;
  meta: Record<string, any>;
  options: any[];
  parent: string;
  provider: string;
  route: Record<string, any>;
  title: string;
  url: string;
  weight: number;
  metatag: any[];
  content_translation_source: string;
  content_translation_outdated: boolean;
  content_translation_status: boolean;
  content_translation_created: string;
  content_translation_uid: Record<string, any>;
  relationshipNames: string[];
};

type NavigationMenuProps = {
  menuLinks: DrupalMenuItem[];
};

const NavigationMenu: React.FC<NavigationMenuProps> = ({ menuLinks }) => {
  // Function to render menu items recursively if they have children
  const renderMenuItems = (items: DrupalMenuItem[], parentId: string = "") => {
    // console.log("Rendering items for parentId:", parentId);
    const filteredItems = items.filter((item) => item.parent === parentId);

    return filteredItems
      .sort((a, b) => Number(a.weight) - Number(b.weight))
      .map((item) => (
        <li key={item.id}>
          <Link href={item.url}>{item.url}</Link>
          {item.expanded && <ul>{renderMenuItems(items, item.id)}</ul>}
        </li>
      ));
  };

  return (
    <nav>
      <ul>{renderMenuItems(menuLinks)}</ul>
    </nav>
  );
};

export default NavigationMenu;
