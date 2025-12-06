import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  getAllPTO,
  // createPtoController,
  // getPtoByIdController,
  // updatePtoController,
  // deletePtoController,
  // updatePendingPtoController,
  // updateApprovedPtoController,
  // updateRejectedPtoController,
  createPtoController,
  updatePtoRequestController,
} from "../controllers/ptoManagement.controller";
const router = Router();

router.use(apiLimiter);
router.use(authenticateToken);
router.post("/", createPtoController);
router.get("/", getAllPTO);
router.patch("/:id", updatePtoRequestController);

// This code has been commented out because it was using Firestore.
// Our project has now migrated to Data Connect.

// router.get("/", getAllPTO);
// router.get("/pto/:ptoId", getPtoByIdController);
// router.post("/", createPtoController);
// router.put("/:ptoId", updatePtoController);
// router.patch("ptoPending/:ptoId", updatePendingPtoController);
// router.patch("ptoApproved/:ptoId", updateApprovedPtoController);
// router.patch("ptoRejected/:ptoId", updateRejectedPtoController);
// router.delete("/:ptoId", deletePtoController);

export { router as PtoManagementRoutes };
