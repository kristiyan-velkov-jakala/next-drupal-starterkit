import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(5, "Please write a msssg between 5 and 10 chars")
    .max(10),
  email: z.string().email("Invalid email address"),
  subject: z.string().nonempty("Subject is required"),
  message: z.string().nonempty("Message is required"),
});
export type FormValues = z.infer<typeof formSchema>;
