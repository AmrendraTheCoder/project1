import { z } from "zod";

export const rumourSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  age: z.number().int().positive().optional(),
  expire_at: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    {
      message: "Invalid date format for expire_at",
    }
  ),
});
