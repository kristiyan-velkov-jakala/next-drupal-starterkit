// app/actions/formActions.ts

"use server";

import { getAccessToken } from "next-drupal";

import { formSchema } from "@/app/formSchema";

export type FormState = {
  message: string;
};
export type ServerAction<T> = (data: T) => Promise<void>;

export async function submitFormAction(data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data.entries());
  const parsed = formSchema.safeParse(formData);
  console.log(formData);
  if (!parsed.success) {
    return {
      message: "Invalid form data",
    };
  }
  const token = await getAccessToken();
  // Submit to Drupal
  const url = new URL(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/webform_rest/submit`,
  ); // Replace with actual Drupal URL
  const result = await fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify({
      webform_id: "contact",
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  if (!result.ok) {
    console.log("Form submission failed");
    throw new Error(result.statusText);
    // return {
    //   message: "Form submission failed",
    // };
  }
  console.log("Form submitted successfully");
  return { message: "Form submitted successfully" };
}
