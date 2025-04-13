import { Router } from "express";
import { registerSchema } from "../validation/authValidations.js";
import { formatError, renderEmailEjs } from "../helper.js";
import { ZodError } from "zod";
import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
import { emailQueue, emailQueueName } from "../jobs/Emailjob.js";
const router = Router();
// Updated handler using RequestHandler type implicitly
router.post("/register", function (req, res, next) {
    const processRegistration = async () => {
        try {
            const body = req.body;
            const payload = registerSchema.parse(body);
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
            // Encrypt the password
            const salt = await bcrypt.genSalt(10);
            payload.password = await bcrypt.hash(payload.password, salt);
            const token = await bcrypt.hash(uuid4(), salt);
            const url = `${process.env.APP_URL}/verify-email?email=${payload.email}&token=${token}`;
            // Create the user FIRST, before sending email
            await prisma.user.create({
                data: {
                    name: payload.name,
                    email: payload.email,
                    password: payload.password,
                    email_verify_token: token,
                },
            });
            const emailBody = await renderEmailEjs("verify-email", {
                name: payload.name,
                url: url,
            });
            // Send Email after user creation is successful
            await emailQueue.add(emailQueueName, {
                to: payload.email,
                subject: "Rumor Email Verification",
                body: emailBody,
            });
            return res.json({
                message: "Account created successfully! Please check your email for verification.",
            });
        }
        catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                const errors = formatError(error);
                return res.status(422).json({ message: "invalid data", errors });
            }
            return res
                .status(500)
                .json({ message: "Something went wrong. Please try again!" });
        }
    };
    processRegistration().catch(next);
});
export default router;
