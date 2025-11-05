import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { createModuleProfile, getModuleProfiles } from "../controllers/data_connect/moduleProfileController";

const router = Router();

router.use(apiLimiter)
// router.use(authenticateToken)

//POST /api/moduleProfiles  create new project
router.post("/",createModuleProfile);

//GET /api/moduleProfiles get all projects
router.get("/", getModuleProfiles)

// //GET /api/projects/:id get project by id
// router.get("/:id", getProjectById)

export {router as moduleProfileRoutes};