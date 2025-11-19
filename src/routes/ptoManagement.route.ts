import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  createPtoController,
  getAllPTO,
  getPtoByIdController,
  updatePtoController,
  deletePtoController,
  updatePendingPtoController,
  updateApprovedPtoController,
  updateRejectedPtoController,
} from "../controllers/ptoManagement.controller";
const router = Router();

router.use(apiLimiter);
router.use(authenticateToken);

router.get("/", getAllPTO);
router.get("/pto/:ptoId", getPtoByIdController);
router.post("/", createPtoController);
router.put("/:ptoId", updatePtoController);
router.patch("ptoPending/:ptoId", updatePendingPtoController);
router.patch("ptoApproved/:ptoId", updateApprovedPtoController);
router.patch("ptoRejected/:ptoId", updateRejectedPtoController);
router.delete("/:ptoId", deletePtoController);

export { router as PtoManagementRoutes };
