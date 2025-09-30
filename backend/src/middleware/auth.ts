import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  let token: string | null = null;

  // 1. Check for Bearer token in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. If no header token, check for token in query string
  if (!token && req.query.token) {
    token = req.query.token as string;
  }

  // 3. If no token found in either location, deny access
  if (!token) {
    return res.status(401).json({ error: "User not authenticated: No token provided" });
  }

  // 4. Verify the token
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if the authenticated user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Passport attaches the user object to the request. 
  // We need to assert the type to access custom properties like 'role'.
  const user = req.user as { role?: string };

  if (user && user.role === 'admin') {
    return next();
  }
  
  res.status(403).json({ error: 'Forbidden: Requires admin privileges' });
};
