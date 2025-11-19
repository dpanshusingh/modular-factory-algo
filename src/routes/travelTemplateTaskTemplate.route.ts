import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import {
  createTravelerTemplateTaskTemplateController,
  deleteTravelerTemplateTaskTemplateController,
  getAllTravelerTemplateTaskTemplateController,
  getTravelerTemplateTaskTemplateByIdController,
  updateTravelerTemplateTaskTemplateController,
} from "../controllers/travelTemplateTaskTemplate.controller";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createTravelerTemplateTaskTemplateSchema,
  deleteTravelerTemplateTaskTemplateSchema,
  getTravelerTemplateTaskTemplateByIdSchema,
  updateTravelerTemplateTaskTemplateSchema,
} from "../utils/validators/travelerTemplateTaskTemplate.validation";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiLimiter);
router.use(authenticateToken);

router.post(
  "/",
  validateRequest(createTravelerTemplateTaskTemplateSchema),
  createTravelerTemplateTaskTemplateController
);
router.get("/", getAllTravelerTemplateTaskTemplateController);
router.get(
  "/:id",
  validateRequest(getTravelerTemplateTaskTemplateByIdSchema),
  getTravelerTemplateTaskTemplateByIdController
);
router.put(
  "/:id",
  validateRequest(updateTravelerTemplateTaskTemplateSchema),
  updateTravelerTemplateTaskTemplateController
);
router.delete(
  "/:id",
  validateRequest(deleteTravelerTemplateTaskTemplateSchema),
  deleteTravelerTemplateTaskTemplateController
);

export { router as travelerTemplateTaskTemplateRoutes };
