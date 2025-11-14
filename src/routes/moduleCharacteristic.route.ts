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

router.post("/", createModuleCharacteristic);
router.get("/", getAllModuleCharacteristics);
router.post("/many", createManyModuleCharacteristics);
router.get("/many/:id", getModuleCharacteristicsByIdController);
router.put("/:id", updateModuleCharacteristic);
router.delete("/:id", deleteModuleCharacteristic);
router.delete("/many/:id", deleteModuleCharacteristicsByIdController);

// router.put("/updatemany",updateManyModuleCharacteristics)
export { router as moduleCharacteristicsRoutes };
