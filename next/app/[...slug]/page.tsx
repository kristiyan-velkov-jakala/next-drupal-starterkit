import {
  isRedirectError,
  permanentRedirect,
} from "next/dist/client/components/redirect";
import { draftMode } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { getAccessToken, JsonApiParams, Locale } from "next-drupal";
import { getDraftData } from "next-drupal/draft";

import { Article } from "@/components/drupal/Article";
import { BasicPage } from "@/components/drupal/BasicPage";
import DynamicForm from "@/components/forms/DynamicForm";
import { drupal } from "@/lib/drupal/drupal";

import { submitFormAction } from "@/app/formSubmit";

async function getNode(lang: Locale, slug: string[]) {
  const [langCode, ...pathParts] = slug;
  const path = `/${pathParts.join("/")}`;
  // console.log("Path:", path);

  const params: JsonApiParams = {};
  const draftData = getDraftData();

  if (draftData.path === path) {
    params.resourceVersion = draftData.resourceVersion;
  }

  const translatedPath = await drupal.translatePath(langCode + path);

  if (!translatedPath) {
    throw new Error("Resource not found", { cause: "NotFound" });
  }

  // Check for redirect.
  if (translatedPath.redirect?.length) {
    const redirectTo = translatedPath.redirect[0].to;
    // use correct redirect funciton based on status

    if (translatedPath.redirect[0].status === "301") {
      permanentRedirect(redirectTo, RedirectType.push);
    } else {
      redirect(redirectTo, RedirectType.push);
    }
  }

  const type = translatedPath.jsonapi?.resourceName;
  const uuid = translatedPath.entity.uuid;

  if (type === "node--article") {
    params.include = "field_image,uid";
  }

  const resource = await drupal.getResourceByPath(path, {
    params: {
      include: "field_image,uid",
      sort: "-created",
    },
    defaultLocale: "en",
    locale: langCode,
  });

  if (!resource) {
    throw new Error(
      `Failed to fetch resource: ${translatedPath?.jsonapi?.individual}`,
      {
        cause: "DrupalError",
      },
    );
  }

  console.log(resource);

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

export default async function NodePage({
  params: { slug, lang },
  searchParams,
}: NodePageProps) {
  const isDraftMode = draftMode().isEnabled;
  const headers = {};
  let node;
  try {
    node = await getNode(lang, slug);
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) {
      throw error;
    }
    return <>:) Not found</>;
  }
  // const accessToken = getAccessToken();
  // console.log(accessToken);

  const token = await getAccessToken();
  // console.log(token);
  if (token) {
    headers["Authorization"] = `Bearer ${token.access_token}`;
  }

  const response = await fetch(
    `https://next-drupal-starterkit.lndo.site/en/webform_rest/contact/fields`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
    },
  );

  if (!response.ok) {
    console.log(response);
    throw new Error(response.statusText);
  }
  const form = await response.json();
  // console.log(form);
  // If we're not inonSubmit draft mode and the resource is not published, return a 404.
  if (!isDraftMode && node?.status === false) {
    return <>Not found</>;
    // notFound();
  }
  /*const webform = await drupal.getResource(
    "webform--webform",
    "d44519bc-f194-4fff-9bd8-af231970e60e",
  );*/
  // console.log(webform);
  return (
    <>
      <DynamicForm formData={form} onSubmit={submitFormAction} />
      {node.type === "node--page" && <BasicPage node={node} />}
      {node.type === "node--article" && <Article node={node} />}
    </>
  );
}
