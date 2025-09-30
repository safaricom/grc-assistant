import { Router } from 'express';
import { getUsers, getUser, updateUser, deleteUser, createUser } from '../controllers/userController';
import { isAuthenticated, isAdmin } from '../middleware/auth';

const router = Router();

// These routes are for admin users to manage all users.
// Every route requires the user to be an authenticated admin.
router.get('/', [isAuthenticated, isAdmin], getUsers);
router.get('/:id', [isAuthenticated, isAdmin], getUser);
router.post('/', [isAuthenticated, isAdmin], createUser);
router.put('/:id', [isAuthenticated, isAdmin], updateUser);
router.delete('/:id', [isAuthenticated, isAdmin], deleteUser);

export default router;
