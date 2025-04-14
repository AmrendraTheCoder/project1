import { z } from "zod";
export const forgetPasswordSchema = z.object({
    email: z
        .string({ message: "Email is required" })
        .email({ message: "Email must be a correct email." }),
});
export const resetPasswordSchema = z
    .object({
    email: z
        .string({ message: "Email is required" })
        .email({ message: "Please provide a valid email address" }),
    token: z
        .string({ message: "Token is required" }),
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
});
