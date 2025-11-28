import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { createTaskTemplateController, deleteTaskTemplateController, getAllTaskTemplatesController, getTaskTemplateByIdController, updateTaskTemplateController } from "../controllers/taskTemplate.controller";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createTaskTemplateSchema, deleteTaskTemplateSchema, updateTaskTemplateSchema } from "../utils/validators/taskTemplateValidation";

const router = Router()

router.use(apiLimiter)
//router.use(authenticateToken)

router.post("/", validateRequest(createTaskTemplateSchema) , createTaskTemplateController)
router.get("/", getAllTaskTemplatesController)
router.get("/:id", getTaskTemplateByIdController)
router.put("/:id", validateRequest(updateTaskTemplateSchema), updateTaskTemplateController)
router.delete("/:id", validateRequest(deleteTaskTemplateSchema), deleteTaskTemplateController)

export {router as taskTemplateRoutes}