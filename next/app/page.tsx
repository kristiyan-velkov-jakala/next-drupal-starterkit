import type { Metadata } from "next";
import type { Locale } from "next-drupal";

import { DeleteMe } from "@/components/delete_me";
import { getData } from "@/lib/fetchArticle";

export const metadata: Metadata = {
  description: "A Next.js site powered by a Drupal backend.",
};

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  // console.log(lang);
  /*const nodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params: {
        "filter[status]": 1,
        "fields[node--article]": "title,path,field_image,uid,created",
        include: "field_image,uid",
        sort: "-created",
      },
      defaultLocale: "en",
      locale: "fi",
    },
  );*/
  const article = getData(
    `/articles/nextjs-kayttokokemuksen-parantaminen-suorituskyvyn-optimoinnin-avulla`,
  );
  // console.log(article);

  // const menu = await drupal.getMenu("main", {
  //   defaultLocale: "en",
  //   locale: "en",
  // });
  // const { menu: , items } = await drupal.getMenu("main");

  /*if (!article || !article.field_components?.length) {
    throw new Error("Invalid path or missing field components");
  }*/

  /* const article = await drupal.getResource(
    "node--article",
    "a7448918-8d9f-4dcc-a457-692ad2c85407",
    {
      params: {
        "filter[status]": 1,
        "fields[node--article]": "title,path,field_image,uid,created",
        include: "field_image,uid",
        sort: "-created",
      },
      defaultLocale: "en",
      locale: "fi",
    },
  );*/

  // console.log(article);
  return (
    <>
      <DeleteMe />
      {/*<pre>{JSON.stringify(json)}</pre>*/}
      {/*<Article node={article} />*/}
      {/* {nodes?.length ? (
        nodes.map((node) => (
          <div key={node.id}>
            <ArticleTeaser node={node} />
            <hr className="my-20" />
          </div>
        ))
      ) : (
        <p className="py-4">No nodes found</p>
      )}*/}
    </>
  );
}
