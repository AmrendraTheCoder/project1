// src/types/custom-types.ts

// Define the AuthUser interface
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  google_id: string;
  image?: string;
  // Add other relevant user properties here
}

// We'll use module augmentation to properly extend Express types
declare global {
  namespace Express {
    // This extends the existing Express.Request interface
    interface Request {
      user?: AuthUser;
    }
  }
}
