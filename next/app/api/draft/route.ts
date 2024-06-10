import type { NextRequest } from "next/server";
import { enableDraftMode } from "next-drupal/draft";

import { drupal } from "@/lib/drupal";

export async function GET(request: NextRequest): Promise<Response | never> {
  return enableDraftMode(request, drupal);
}
