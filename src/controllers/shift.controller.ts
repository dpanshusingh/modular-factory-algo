import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";
import {
  createShift,
  getAllShifts,
  getShiftById,
  getAllShiftsName,
  updateShift,
  updateShiftWeek,
  deleteShift,
} from "../queries/shift.query";

// Create Shift
export const createShiftController = async (req: Request, res: Response) => {
  try {
    const { name, startTime, endTime, lunchStartTime, lunchEndTime } = req.body;
    const id = uuidv4();

    const station = await createShift({
      id,
      name,
      startTime,
      endTime,
      lunchStartTime,
      lunchEndTime,
    });

    res.status(201).json({
      success: true,
      message: "Shift created successfully",
      data: station,
    });
  } catch (error: any) {
    console.error("Create shift error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create Shift
export const updateShiftWeekController = async (req: Request, res: Response) => {
  try {
    const { id, weekdayOrdinals } = req.body;

    const station = await updateShiftWeek({
      id,
      weekdayOrdinals,
    });

    res.status(200).json({
      success: true,
      message: "Shift weekdays updated successfully",
      data: station,
    });
  } catch (error: any) {
    console.error("Update shift week error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// Get All shifts
export const getAllShiftsController = async (_req: Request, res: Response) => {
  try {
    const shifts = await getAllShifts();
    res.status(200).json({
      success: true,
      data: { shifts: shifts },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllShiftsNameController = async (
  _req: Request,
  res: Response
) => {
  try {
    const shifts = await getAllShiftsName();
    res.status(200).json({
      success: true,
      data: { shifts: shifts },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single shift
export const getShiftByIDController = async (req: Request, res: Response) => {
  try {
    const shift = await getShiftById(req.params.id);
    if (!shift!) return res.status(404).json({ message: "Not found" });
    res.status(201).json({ success: true, data: shift });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Shift
export const updateShiftController = async (req: Request, res: Response) => {
  try {
    const shift = await updateShift(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: "Shift updated successfully",
      data: shift,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Shift
export const deleteShiftController = async (req: Request, res: Response) => {
  try {
    await deleteShift(req.params.id);
    res.status(200).json({
      success: true,
      message: "Shift deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
