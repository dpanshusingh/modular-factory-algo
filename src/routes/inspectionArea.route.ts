import { createInspectionAreaController, deleteInspectionAreasController, getAllInspectionAreasController, updateInspectionAreasController } from '../controllers/inspectionArea.controller';
import { apiLimiter } from './../middlewares/rateLimiter';
import { Router } from "express";

const router = Router();
router.use(apiLimiter)

router.post("/", createInspectionAreaController);
router.get("/", getAllInspectionAreasController);
router.put("/:id", updateInspectionAreasController);
router.delete("/:id", deleteInspectionAreasController);

export {router as inspectionAreaRoutes}