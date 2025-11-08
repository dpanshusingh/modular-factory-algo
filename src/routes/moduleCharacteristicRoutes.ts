import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { createManyModuleCharacteristics, createModuleCharacteristic, deleteModuleCharacteristic, getAllModuleCharacteristics, getModuleCharacteristicsByIdController, updateManyModuleCharacteristics, updateModuleCharacteristic } from "../controllers/data_connect/moduleCharacteristicController";

const router = Router();

router.use(apiLimiter)

router.post("/",createModuleCharacteristic)
router.get("/",getAllModuleCharacteristics)
router.get("/:id", getModuleCharacteristicsByIdController)
router.put("/:id",updateModuleCharacteristic)
router.delete("/:id",deleteModuleCharacteristic)

router.post("/many",createManyModuleCharacteristics)
// router.put("/updatemany",updateManyModuleCharacteristics)
export {router as moduleCharacteristicsRoutes};