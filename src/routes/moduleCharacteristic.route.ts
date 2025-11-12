import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import {
  createManyModuleCharacteristics,
  createModuleCharacteristic,
  deleteModuleCharacteristic,
  deleteModuleCharacteristicsByIdController,
  getAllModuleCharacteristics,
  getModuleCharacteristicsByIdController,
  updateManyModuleCharacteristics,
  updateModuleCharacteristic,
} from "../controllers/moduleCharacteristic.controller";

const router = Router();

router.use(apiLimiter);

router.post("/", createModuleCharacteristic); // used
router.get("/", getAllModuleCharacteristics); //
router.post("/many", createManyModuleCharacteristics);
router.get("/many/:id", getModuleCharacteristicsByIdController); //used
router.put("/:id", updateModuleCharacteristic); //used
router.delete("/:id", deleteModuleCharacteristic);
router.delete("/many/:id", deleteModuleCharacteristicsByIdController); //used

// router.put("/updatemany",updateManyModuleCharacteristics)
export { router as moduleCharacteristicsRoutes };
