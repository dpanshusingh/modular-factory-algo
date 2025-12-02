import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import {
  createShiftController,
  deleteShiftController,
  getAllShiftsController,
  getShiftByIDController,
  updateShiftController,
  getAllShiftsNameController,
  updateShiftWeekController,
} from "../controllers/shift.controller";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createShiftSchema,
  deleteShiftSchema,
  updateShiftSchema,
  getShiftByIdSchema,
} from "../utils/validators/shiftValidator";

const router = Router();

router.use(apiLimiter);
//router.use(authenticateToken);

router.post("/", validateRequest(createShiftSchema), createShiftController);
router.get("/", getAllShiftsController);
router.get("/shiftName", getAllShiftsNameController);
router.put("/updateWeek", updateShiftWeekController);

router.get("/:id", validateRequest(getShiftByIdSchema), getShiftByIDController);
router.put("/:id", validateRequest(updateShiftSchema), updateShiftController);

router.delete(
  "/:id",
  validateRequest(deleteShiftSchema),
  deleteShiftController
);

export { router as shiftRoutes };
