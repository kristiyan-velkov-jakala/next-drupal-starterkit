import { draftMode } from "next/headers";
import { Suspense } from "react";

import { DraftAlertClient } from "./Client";

export function DraftAlert() {
  const isDraftEnabled = draftMode().isEnabled;

  return (
    <Suspense fallback={null}>
      <DraftAlertClient isDraftEnabled={isDraftEnabled} />
    </Suspense>
  );
}
