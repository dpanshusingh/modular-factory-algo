import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { createTaskTemplateController, deleteTaskTemplateController, getAllTaskTemplatesController, getTaskTemplateByIdController, updateTaskTemplateController } from "../controllers/taskTemplate.controller";

const router = Router()

router.use(apiLimiter)

router.post("/", createTaskTemplateController)
router.get("/", getAllTaskTemplatesController)
router.get("/:id", getTaskTemplateByIdController)
router.put("/:id", updateTaskTemplateController)
router.delete("/:id", deleteTaskTemplateController)

export {router as taskTemplateRoutes}