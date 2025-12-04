import { Router } from "express";
import { handleChatMessage } from "../controllers/chatController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { apiLimiter } from "../middlewares/rateLimiter";

const router = Router();

/**
 * POST /api/chat
 * Handle incoming chat messages
 * Protected by Firebase auth and rate limiting
 */
router.post("/", authenticateToken, apiLimiter, handleChatMessage);

export { router as chatRoutes };
