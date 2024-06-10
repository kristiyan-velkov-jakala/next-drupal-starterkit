import type { NextApiRequest, NextApiResponse } from "next";

import { drupal } from "@/lib/drupal";

export default async function preview(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  await drupal.preview(request, response);
}
