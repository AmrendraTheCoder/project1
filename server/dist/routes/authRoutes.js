import { Router } from "express";
import { registerSchema } from "../validation/authValidations.js";
import { formatError } from "../helper.js";
import { ZodError } from "zod";
import prisma from "../config/database.js";
import bcrypt from "bcrypt";
const router = Router();
// * Register route
router.post("/register", async (req, res) => {
    try {
        const body = req.body;
        const payload = registerSchema.parse(body);
        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { email: payload.email },
        });
        if (user) {
            return res.status(422).json({
                errors: {
                    email: "Email already exists. Please use another one.",
                },
            });
        }
        // * Encrypt the password - fixed version
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(payload.password, salt);
        // Create user with properly formatted data matching your schema
        await prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: hashedPassword,
                // Omitting properties that should have defaults or be null
            },
        });
        return res.json({ message: "Account created Successfully!" });
    }
    catch (error) {
        console.error("Registration error:", error);
        if (error instanceof ZodError) {
            const errors = formatError(error);
            return res.status(422).json({ message: "Invalid data", errors });
        }
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again!" });
    }
});
export default router;
