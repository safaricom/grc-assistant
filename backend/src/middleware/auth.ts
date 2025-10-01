import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";

const { JWT_SECRET } = process.env;

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
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

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    
    // 5. Verify user still exists in database
    const userExists = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
      columns: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!userExists) {
      console.log(`[AUTH] Token valid but user not found in DB: ${decoded.email} (${decoded.id})`);
      return res.status(401).json({ 
        error: "User account no longer exists. Please log in again.",
        code: "USER_NOT_FOUND"
      });
    }

    // Attach user to request
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: "Token expired. Please log in again.",
        code: "TOKEN_EXPIRED"
      });
    }
    console.error("[AUTH] Unexpected error:", err);
    return res.status(500).json({ error: "Authentication failed" });
  }
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
