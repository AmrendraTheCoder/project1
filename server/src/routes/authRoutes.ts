import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "../validation/authValidations.js";
import { formatError, renderEmailEjs } from "../helper.js";
import { ZodError } from "zod";
import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
import jwt from "jsonwebtoken";
import { emailQueue, emailQueueName } from "../jobs/Emailjob.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { authLimiter } from "../config/rateLimit.js";
const router = Router();

// * Login Routes
router.post(
  "/login",
  authLimiter,
  (req: Request, res: Response, next: NextFunction): void => {
    const processLogin = async () => {
      try {
        const body = req.body;
        const payload = loginSchema.parse(body);
        // * Check email
        let user = await prisma.user.findUnique({
          where: { email: payload.email },
        });
        if (!user || user === null) {
          res.status(422).json({
            message: "Authentication failed",
            errors: { email: "No user found with this email." },
          });
          return;
        }
        // * Check password
        const compare = await bcrypt.compare(payload.password, user.password);
        if (!compare) {
          res.status(422).json({
            message: "Authentication failed",
            errors: {
              password: "Invalid password.",
            },
          });
          return;
        }
        // * JWT Payload
        let JWTPayload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        // Make sure SECRET_KEY is set
        if (!process.env.SECRET_KEY) {
          throw new Error("SECRET_KEY is not defined in environment variables");
        }
        const token = jwt.sign(JWTPayload, process.env.SECRET_KEY, {
          expiresIn: "365d",
        });
        res.status(200).json({
          message: "Logged in successfully!",
          data: {
            ...JWTPayload,
            token: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Login error:", error);
        if (error instanceof ZodError) {
          const errors = formatError(error);
          res.status(422).json({
            message: "Invalid login data",
            errors,
          });
          return;
        }
        res.status(500).json({
          message: "Something went wrong. Please try again later.",
          errors: { general: "Server error during login" },
        });
      }
    };
    processLogin().catch((error) => {
      console.error("Unhandled login error:", error);
      next(error);
    });
  }
);

// * Login Check routes
router.post(
  "/check/credentials",
  authLimiter,
  (req: Request, res: Response, next: NextFunction): void => {
    const processLogin = async () => {
      try {
        const body = req.body;
        const payload = loginSchema.parse(body);
        // * Check email
        let user = await prisma.user.findUnique({
          where: { email: payload.email },
        });
        if (!user || user === null) {
          res.status(422).json({
            message: "Authentication failed",
            errors: { email: "No user found with this email." },
          });
          return;
        }
        // * Check password
        const compare = await bcrypt.compare(payload.password, user.password);
        if (!compare) {
          res.status(422).json({
            message: "Authentication failed",
            errors: {
              password: "Invalid password.",
            },
          });
          return;
        }
        // * JWT Payload
        let JWTPayload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        // Make sure SECRET_KEY is set
        if (!process.env.SECRET_KEY) {
          throw new Error("SECRET_KEY is not defined in environment variables");
        }
        const token = jwt.sign(JWTPayload, process.env.SECRET_KEY, {
          expiresIn: "365d",
        });
        res.status(200).json({
          message: "Logged in successfully!",
          data: {
            ...JWTPayload,
            token: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Login error:", error);
        if (error instanceof ZodError) {
          const errors = formatError(error);
          res.status(422).json({
            message: "Invalid login data",
            errors,
          });
          return;
        }
        res.status(500).json({
          message: "Something went wrong. Please try again later.",
          errors: { general: "Server error during login" },
        });
      }
    };
    processLogin().catch((error) => {
      console.error("Unhandled login error:", error);
      next(error);
    });
  }
);

// * Register Routes
router.post(
  "/register",
  authLimiter,
  (req: Request, res: Response, next: NextFunction): void => {
    const processRegistration = async () => {
      try {
        const body = req.body;
        const payload = registerSchema.parse(body);
        let user = await prisma.user.findUnique({
          where: { email: payload.email },
        });
        if (user) {
          res.status(422).json({
            errors: {
              email: "Email already exists. Please use another one.",
            },
          });
          return;
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
        res.json({
          message:
            "Account created successfully! Please check your email for verification.",
        });
      } catch (error) {
        console.log(error);
        if (error instanceof ZodError) {
          const errors = formatError(error);
          res.status(422).json({ message: "invalid data", errors });
          return;
        }
        res.status(500).json({
          message: "Something went wrong. Please try again!",
        });
      }
    };
    processRegistration().catch(next);
  }
);

// * Get User
router.get("/user", authMiddleware, (req: Request, res: Response): void => {
  const user = req.user;
  // await testQueue.add(testQueueName, user);
  res.json({ message: "Fetched", user });
});

export default router;
