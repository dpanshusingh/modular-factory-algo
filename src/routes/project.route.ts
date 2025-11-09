import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { apiLimiter } from "../middlewares/rateLimiter";
import { createProjectController, deleteProjectController, getAllProjectsController, updateProjectController } from "../controllers/project.controller";

const router = Router();

router.use(apiLimiter)
// router.use(authenticateToken)

//POST /api/projects  create new project
router.post("/",createProjectController);

//GET /api/projects get all projects
router.get("/", getAllProjectsController)

//GET /api/projects/:id get project by id
router.put("/:id", updateProjectController)

//DELETE /api/projects/:id get project by id
router.delete("/:id", deleteProjectController)

export {router as projectRoutes};