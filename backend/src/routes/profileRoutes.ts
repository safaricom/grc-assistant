import { Router } from 'express';
import { updateProfile, getCurrentProfile } from '../controllers/userController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// This route is for the logged-in user to update or view their own profile.
// It only requires authentication, not admin rights.
router.put('/', isAuthenticated, updateProfile);
router.get('/', isAuthenticated, getCurrentProfile);

export default router;
