import { Request, Response } from "express";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import passport from "passport";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    return res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
// ... (imports and other functions)

export const loginUser = (req: Request, res: Response, next: any) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info.message || "Login failed" });
    }
    req.login(user, { session: false }, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      // User is authenticated, generate a JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET!,
        { expiresIn: "1h" }
      );
      // The user object from passport is already sanitized (no password hash)
      return res.json({ user, token });
    });
  })(req, res, next);
};

export const getCurrentUser = async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const sessionUser = req.user as { id: string };
    try {
      const userFromDb = await db.query.users.findFirst({
        where: eq(users.id, sessionUser.id),
        columns: {
          passwordHash: false, // Explicitly exclude the password hash
        },
      });

      if (!userFromDb) {
        return res.status(404).json({ error: "User not found" });
      }
      
      return res.json(userFromDb);
    } catch (error) {
      console.error("Error fetching current user from DB:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  return res.status(401).json({ error: "Not authenticated" });
};
