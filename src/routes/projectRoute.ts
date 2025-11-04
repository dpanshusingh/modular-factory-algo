import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { apiLimiter } from "../middlewares/rateLimiter";
import { createProject, getAllProjects } from "../controllers/data_connect/projectController";

const router = Router();

router.use(apiLimiter)
// router.use(authenticateToken)

//POST /api/projects  create new project
router.post("/",createProject);

//GET /api/projects get all projects
router.get("/", getAllProjects)

// //GET /api/projects/:id get project by id
// router.get("/:id", getProjectById)

export {router as projectRoutes};