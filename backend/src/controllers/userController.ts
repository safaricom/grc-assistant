import { Request, Response } from 'express';
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db.insert(users).values({
      name,
      email,
      passwordHash,
      role,
    }).returning();

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    // Check for unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') { // Postgres unique violation error code
        return res.status(409).json({ message: 'User with this email already exists' });
    }
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await db.select().from(users).where(eq(users.id, id));
  if (user.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user[0]);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const updatedUser = await db.update(users).set({
    name,
    email,
    role,
  }).where(eq(users.id, id)).returning();

  if (updatedUser.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(updatedUser[0]);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedUser = await db.delete(users).where(eq(users.id, id)).returning();

  if (deletedUser.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(204).send();
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  const user = req.user as { id: string }; // Get user from passport session

  if (!user || !user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const updateData: { name?: string; passwordHash?: string } = {};

    if (name) {
      updateData.name = name;
    }

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const getCurrentProfile = async (req: Request, res: Response) => {
  const sessionUser = req.user as { id?: string };
  if (!sessionUser?.id) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const userFromDb = await db.query.users.findFirst({ where: eq(users.id, sessionUser.id) });
    if (!userFromDb) return res.status(404).json({ error: 'User not found' });
    const { passwordHash, ...safe } = userFromDb as any;
    return res.json(safe);
  } catch (err) {
    console.error('Error fetching profile:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
