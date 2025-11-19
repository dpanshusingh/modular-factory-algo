import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { validateRequest } from "../middlewares/validateRequest";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  createTravelerTemplateInspectionItemTemplateController,
  deleteTravelerTemplateInspectionItemTemplateController,
  getAllTravelerTemplateInspectionItemTemplateController,
  getTravelerTemplateInspectionItemTemplateByIdController,
  updateTravelerTemplateInspectionItemTemplateController,
} from "../controllers/travelerTemplateInspectionItemTemplate.controller";
import {
  createTravelerTemplateInspectionItemTemplateSchema,
  deleteTravelerTemplateInspectionItemTemplateSchema,
  getTravelerTemplateInspectionItemTemplateByIdSchema,
  updateTravelerTemplateInspectionItemTemplateSchema,
} from "../utils/validators/travelerTemplateInspectionItemTemplate.validation";

const router = Router();

router.use(apiLimiter);
router.use(authenticateToken);

router.post(
  "/",
  validateRequest(createTravelerTemplateInspectionItemTemplateSchema),
  createTravelerTemplateInspectionItemTemplateController
);
router.get("/", getAllTravelerTemplateInspectionItemTemplateController);
router.get(
  "/:id",
  validateRequest(getTravelerTemplateInspectionItemTemplateByIdSchema),
  getTravelerTemplateInspectionItemTemplateByIdController
);
router.put(
  "/:id",
  validateRequest(updateTravelerTemplateInspectionItemTemplateSchema),
  updateTravelerTemplateInspectionItemTemplateController
);
router.delete(
  "/:id",
  validateRequest(deleteTravelerTemplateInspectionItemTemplateSchema),
  deleteTravelerTemplateInspectionItemTemplateController
);

export { router as travelerTemplateInspectionItemTemplateRoutes };
