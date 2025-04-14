import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  google_id: string | null; // Add the missing property
  // Add any other properties that might be in your JWT payload
}

// Instead of redefining the interface, we'll use the existing one
const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (authHeader === null || authHeader === undefined) {
    res.status(401).json({ status: 401, message: "UnAuthorised" });
    return;
  }
  const token = authHeader.split(" ")[1];

  // * Verify the JWT token
  jwt.verify(token, process.env.SECRET_KEY!, (err, user) => {
    if (err) {
      res.status(401).json({ status: 401, message: "UnAuthorized" });
      return;
    }

    // Use type assertion without specifying the interface name
    req.user = user as any;
    next();
  });
};

export default authMiddleware;
