import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters"),
  description: z
    .string()
    .min(4, "Description must be at least 4 characters")
    .max(400, "Description cannot be more than 400 characters"),
  location: z
    .string()
    .min(4, "Locationn must be at least 4 characters")
    .max(400, "Locationn cannot be more than 400 characters"),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
});
