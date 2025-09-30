import { Router } from 'express';
import { updateProfile } from '../controllers/userController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// This route is for the logged-in user to update their own profile.
// It only requires authentication, not admin rights.
router.put('/', isAuthenticated, updateProfile);

export default router;
