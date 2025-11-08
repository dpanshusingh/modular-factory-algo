import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { createModuleProfileController, deleteModuleProfileController, getAllModuleProfilesController, getModuleProfileByIdController, updateModuleProfileController } from "../controllers/moduleProfile.controller";

const router = Router();

router.use(apiLimiter)

router.post("/", createModuleProfileController)
router.get("/", getAllModuleProfilesController)
router.get("/:id", getModuleProfileByIdController)
router.put("/:id", updateModuleProfileController)
router.delete("/:id", deleteModuleProfileController)

export {router as moduleProfileRoutesCheck};    