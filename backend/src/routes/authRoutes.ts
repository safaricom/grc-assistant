import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { isAuthenticated } from "../middleware/auth";
import { getCurrentUser } from "../controllers/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isAuthenticated, getCurrentUser);

// Backwards-compatible alias used by some clients / tests
router.post('/callback/credentials', loginUser);

// Expose profile endpoint for convenience (GET /api/profile should return current user)
// Note: the actual profile update route is in profileRoutes (PUT /api/profile)

export default router;
