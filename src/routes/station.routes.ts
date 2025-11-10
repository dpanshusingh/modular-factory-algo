import { Router } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { createStationController, deleteStationController, getAllStationsController, getStationByIDController, updateStationController } from "../controllers/station.controller";

const router = Router()

router.use(apiLimiter)

router.post("/", createStationController)
router.get("/", getAllStationsController)
router.get("/:id", getStationByIDController)
router.put("/:id", updateStationController)
router.delete("/:id", deleteStationController)

export {router as stationRoutes}