import { Request, Response } from "express";
import {
  createInspectionArea,
  deleteInspectionArea,
  getAllInspectionArea,
  updateInspectionArea,
} from "../queries/inspectionArea.query";
import { v4 as uuidv4 } from "uuid";

// ✅ Create Inspection Area
export const createInspectionAreaController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, order } = req.body;
    const id = uuidv4();

    const inspectionArea = await createInspectionArea({id, name, order });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: inspectionArea,
    });
  } catch (error: any) {
    console.error("Create inspection area error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Read Inspection Areas
export const getAllInspectionAreasController = async (
  req: Request,
  res: Response
) => {
  try {
    const projects = await getAllInspectionArea();
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    console.error("Get inspection area error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Inspection Areas
export const updateInspectionAreasController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;
    if (!id || !name || !order) {
      return res.status(400).json({
        success: false,
        message: "Inspection ID, name and order are required",
      });
    }

    const inspectionArea = await updateInspectionArea(id, { name, order });
    res.status(200).json({
      success: true,
      data: inspectionArea,
    });
  } catch (error: any) {
    console.error("Update inspection area error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Inspection Areas
export const deleteInspectionAreasController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    if(!id) {
        return res.status(400).json({
        success: false,
        message: "Inspection ID is required",
      });
    }
    await deleteInspectionArea(id)
    res.status(200).json({
      success: true,
      message: "Inspection Area deleted successfully"
    });
  } catch (error: any) {
    console.error("Update inspection area error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
