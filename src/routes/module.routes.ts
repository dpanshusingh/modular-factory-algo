import {
  createModuleController,
  deleteModuleeaController,
  updateModuleController,
  getAllModuleController,
  getByIdModuleController,
} from "../controllers/module.controller";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createModuleSchema,
  updateModuleSchema,
  paramModuleSchema,
} from "../utils/validators/moduleValidator";
import { apiLimiter } from "./../middlewares/rateLimiter";
import { Router } from "express";

const router = Router();

router.use(apiLimiter);
router.use(authenticateToken);

router.post("/", validateRequest(createModuleSchema), createModuleController);
router.get("/", getAllModuleController);
router.get("/:id", validateRequest(paramModuleSchema), getByIdModuleController);
router.put("/:id", validateRequest(updateModuleSchema), updateModuleController);
router.delete(
  "/:id",
  validateRequest(paramModuleSchema),
  deleteModuleeaController
);

export { router as moduleRouter };
