import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { registerSchema } from "../validation/authValidations.js";
import { formatError } from "../helper.js";
import { ZodError } from "zod";
import prisma from "../config/database.js";
import bcrypt from "bcrypt";

const router = Router();

// Updated handler using RequestHandler type implicitly
router.post(
  "/register",
  function (req: Request, res: Response, next: NextFunction) {
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

        await prisma.user.create({
          data: payload,
        });
        return res.json({ message: "Account created Successfully!" });
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = formatError(error);
          return res.status(422).json({ message: "invalid data", errors });
        }
        return res
          .status(500)
          .json({ message: "something went wrong. Please try again!" });
      }
    };

    processRegistration().catch(next);
  }
);

export default router;
