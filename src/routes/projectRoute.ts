import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { apiLimiter } from "../middlewares/rateLimiter";
import { createProject, deleteProject, getAllProjects, updateProject } from "../controllers/data_connect/projectController";

const router = Router();

router.use(apiLimiter)
// router.use(authenticateToken)

//POST /api/projects  create new project
router.post("/",createProject);

//GET /api/projects get all projects
router.get("/", getAllProjects)

//GET /api/projects/:id get project by id
router.put("/:id", updateProject)

//DELETE /api/projects/:id get project by id
router.delete("/:id", deleteProject)

export {router as projectRoutes};