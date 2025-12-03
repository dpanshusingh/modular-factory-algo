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
  getAllShiftsWithWorkersCountController,
  getAllAssignedShiftsTotheWeekDaysController,
  getAllAvailableShiftsController,
  getAllUnAvailableShiftsController,
  updateWorkersShiftIdBatchController,
  deleteShiftWeekController
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
router.get("/count", getAllShiftsWithWorkersCountController);
router.get("/byId/:id", validateRequest(getShiftByIdSchema), getShiftByIDController);
router.get("/", getAllShiftsController);
router.get("/assigned", getAllAssignedShiftsTotheWeekDaysController);
router.get("/shiftName", getAllShiftsNameController);
router.get("/avalible", getAllAvailableShiftsController);
router.get("/unavalible", getAllUnAvailableShiftsController);
router.put("/updateWeek", updateShiftWeekController);
router.put("/updateShiftId", updateWorkersShiftIdBatchController);
router.put("/:id", validateRequest(updateShiftSchema), updateShiftController);
router.put("/:id", validateRequest(updateShiftSchema), deleteShiftWeekController);
router.delete(
  "/:id",
  validateRequest(deleteShiftSchema),
  deleteShiftController
);

export { router as shiftRoutes };
