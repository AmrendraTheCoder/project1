import { z } from "zod";

// This schema should match what we're storing in the database
export const registerSchema = z
  .object({
    name: z
      .string({ message: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z
      .string({ message: "Email is required" })
      .email({ message: "Please provide a valid email address" }),
    password: z
      .string({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirm_password: z
      .string({ message: "Confirm Password is required...." })
      .min(6, {
        message: "Confirm Password must be at least 6 characters long",
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })
  .transform(({ confirm_password, ...rest }) => {
    // Remove confirm_password from the data that will be stored
    return rest;
  });
