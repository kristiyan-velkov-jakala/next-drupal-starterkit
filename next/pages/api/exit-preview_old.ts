import type { NextApiRequest, NextApiResponse } from "next";

import { drupal } from "@/lib/drupal";

export default async function exit(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  await drupal.previewDisable(request, response);
}
