// import { drupal } from "@/lib/drupal";
import type { JsonApiParams, Locale } from "next-drupal";
// @ts-ignore
import { getDraftData } from "next-drupal/draft";

import { drupal } from "@/lib/drupal/drupal";

async function getNode(lang: Locale, slug: string[]) {
  console.log(lang);
  console.log(slug);
  const path = `/${slug.join("/")}`;
  const params: JsonApiParams = {};
  /*
        
          const draftData = getDraftData();
        
          if (draftData.path === path) {
            params.resourceVersion = draftData.resourceVersion;
          }
        
          // Translating the path also allows us to discover the entity type.
          // const translatedPath = await drupal.translatePath(`${"/fi/" + path}`);
          console.log(translatedPath);
          if (!translatedPath) {
            throw new Error("Resource not found", { cause: "NotFound" });
          }
        
          const type = translatedPath.jsonapi?.resourceName;
          const uuid = translatedPath.entity.uuid;
        
          if (type === "node--article") {
            params.include = "field_image,uid";
          }
        */

  /*const resource = await drupal.getResource<DrupalNode>(type, uuid, {
            params,
            // defaultLocale: "fi",
            // locale: "fi",
          });*/
  const resource = await drupal.getResourceByPath(path, {
    params: {
      include: "field_image,uid",
      sort: "-created",
    },
    defaultLocale: "en",
    locale: lang,
  });
  /*if (!resource) {
            throw new Error(
              `Failed to fetch resource: ${translatedPath?.jsonapi?.individual}`,
              {
                cause: "DrupalError",
              },
            );
          }*/

  return resource;
}

type NodePageParams = {
  slug: string[];
  lang: Locale;
};
type NodePageProps = {
  params: NodePageParams;
  searchParams: { [key: string]: string | string[] | undefined };
};

/*export async function generateMetadata(
  { params: { slug } }: NodePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  let node;
  try {
    node = await getNode(slug);
  } catch (e) {
    // If we fail to fetch the node, don't return any metadata.
    return {};
  }

  return {
    title: node.title,
  };
}*/

const RESOURCE_TYPES = ["node--page", "node--article"];

/*export async function generateStaticParams(): Promise<NodePageParams[]> {
  const resources = await drupal.getResourceCollectionPathSegments(
    RESOURCE_TYPES,
    {
      // The pathPrefix will be removed from the returned path segments array.
      // pathPrefix: "/blog",
      // The list of locales to return.
      // locales: ["efi"],
      // The default locale.
      // defaultLocale: "en",
    },
  );

  return resources.map((resource) => {
    // resources is an array containing objects like: {
    //   path: "/blog/some-category/a-blog-post",
    //   type: "node--article",
    //   locale: "en", // or `undefined` if no `locales` requested.
    //   segments: ["blog", "some-category", "a-blog-post"],
    // }
    return {
      slug: resource.segments,
    };
  });
}*/

export default async function NodePage({
  params: { slug, lang },
  searchParams,
}: NodePageProps) {
  // const isDraftMode = draftMode().isEnabled;

  /*let node;
  try {
    node = await getNode(lang, slug);
  } catch (error) {
    console.log(error);
    // If getNode throws an error, tell Next.js the path is 404.
    notFound();
  }*/

  // If we're not in draft mode and the resource is not published, return a 404.
  // if (!isDraftMode && node?.status === false) {
  //   notFound();
  // }

  return (
    <>
      {/*{node.type === "node--page" && <BasicPage node={node} />}*/}
      {/*{node.type === "node--article" && <Article node={node} />}*/}
    </>
  );
}
