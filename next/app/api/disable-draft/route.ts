import type { NextRequest } from "next/server";
import { disableDraftMode } from "next-drupal/draft";

export async function GET(request: NextRequest) {
  return disableDraftMode();
}
