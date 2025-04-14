import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import prisma from "../config/database.js";
import { authLimiter } from "../config/rateLimit.js";
import { ZodError } from "zod";
import { checkDateHourDiff, formatError, renderEmailEjs } from "../helper.js";
import {
  forgetPasswordSchema,
  resetPasswordSchema,
} from "../validation/passwordValidation.js";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
import { emailQueue, emailQueueName } from "../jobs/Emailjob.js";

const router = Router();

router.post(
  "/forget-password",
  authLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const payload = forgetPasswordSchema.parse(body);

      // * Check the user
      let user = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user || user === null) {
        res.status(422).json({
          message: "invalid data",
          errors: {
            email: "No user found with this email.",
          },
        });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(uuid4(), salt);

      await prisma.user.update({
        data: {
          password_reset_token: token,
          token_send_at: new Date().toISOString(),
        },
        where: {
          email: payload.email,
        },
      });

      const url = `${process.env.CLIENT_APP_URL}/reset-password?email=${payload.email}&token=${token}`;
      const html = await renderEmailEjs("forget-password", { url: url });
      await emailQueue.add(emailQueueName, {
        to: payload.email,
        subject: "Reset Your Password",
        body: html,
      });

      res.json({
        message:
          "Password reset link sent Successfully! Please check your email.",
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
  }
);

// * Reset Password
router.post(
  "/reset-password",
  authLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const payload = resetPasswordSchema.parse(body);

      // * Check the user
      let user = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user || user === null) {
        res.status(422).json({
          message: "invalid data",
          errors: {
            email:
              "Link is not correct, make sure you copied the correct link.",
          },
        });
        return;
      }

      // * Check Token
      if (user?.password_reset_token !== payload.token) {
        res.status(422).json({
          message: "invalid data",
          errors: {
            email:
              "Link is not correct, make sure you copied the correct link.",
          },
        });
        return;
      }

      // * Check 1 Hours timeFrame
      const hoursDiff = checkDateHourDiff(user?.token_send_at!);
      if (hoursDiff > 1) {
        res.status(422).json({
          message: "invalid data",
          errors: {
            email: "Password reset token got expired. Please send new token!",
          },
        });
        return;
      }

      // * Update Password
      const salt = await bcrypt.genSalt(10);
      const newPass = await bcrypt.hash(payload.password, salt);
      await prisma.user.update({
        data: {
          password: newPass,
          password_reset_token: null,
          token_send_at: null,
        },
        where: {
          email: payload.email,
        },
      });

      res.json({
        message: "Password reset successfully! Please try to login now.",
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
  }
);

export default router;
