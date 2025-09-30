import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { isAuthenticated } from "../middleware/auth";
import { getCurrentUser } from "../controllers/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isAuthenticated, getCurrentUser);

export default router;
