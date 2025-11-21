import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";
import {
  createStation,
  deleteStation,
  getAllStations,
  getStationById,
  updateStation,
  stationsCounts,
} from "../queries/station.query";

// Create Station
export const createStationController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      doesReceiveTravelers,
      canReceiveMultipleTravelers,
      inspectionAreaId,
    } = req.body;
    const id = uuidv4();
    const totalStations = stationsCounts();
    const order = (await totalStations) + 1;

    const station = await createStation({
      id,
      name,
      order,
      doesReceiveTravelers,
      canReceiveMultipleTravelers,
      inspectionAreaId,
    });

    res.status(201).json({
      success: true,
      message: "Station created successfully",
      data: station,
    });
  } catch (error: any) {
    console.error("Create station error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get All stations
export const getAllStationsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const stations = await getAllStations();
    res.status(201).json(stations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single station
export const getStationByIDController = async (req: Request, res: Response) => {
  try {
    const station = await getStationById(req.params.id);
    if (!station) return res.status(404).json({ message: "Not found" });
    res.status(201).json({ success: true, data: station });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Station
export const updateStationController = async (req: Request, res: Response) => {
  try {
    const station = await updateStation(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: "Station updated successfully",
      data: station,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Station
export const deleteStationController = async (req: Request, res: Response) => {
  try {
    await deleteStation(req.params.id);
    res.status(200).json({
      success: true,
      message: "Station deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
