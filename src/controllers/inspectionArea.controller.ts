import { Request, Response } from "express";
import {
  createInspectionArea,
  deleteInspectionArea,
  UpdateInspectionAreaOrder,
  updateInspectionArea,
  inspectionAreaCount,
  getInspectionAreaStationOrders,
  getInspectionAreaById,
} from "../queries/inspectionArea.query";
import { v4 as uuidv4 } from "uuid";

// ✅ Create Inspection Area
export const createInspectionAreaController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;
    const id = uuidv4();
    const totalinspectionArea = await inspectionAreaCount();
    const order = totalinspectionArea + 1;
    console.log(totalinspectionArea);
    const inspectionArea = await createInspectionArea({ id, name, order });

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
export const getAllInspectionAreasStationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const station = await getInspectionAreaStationOrders();
    res.status(200).json({
      success: true,
      data: {inspectionAreas:station},
    });
  } catch (error: any) {
    console.error("Get inspection area station error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getInspectionAreaByIDController = async (
  req: Request,
  res: Response
) => {
  try {
    const inspectionArea = await getInspectionAreaById(req.params.id);
    if (!inspectionArea) return res.status(404).json({ message: "Not found" });
    res.status(201).json({ success: true, data: inspectionArea });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateModuleOrderController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    // Body may contain only "order"
    const updatePayload: any = {};
    if (req.body.order !== undefined) updatePayload.order = req.body.order;
    await UpdateInspectionAreaOrder(id, updatePayload);
    const updatedInspectionArea = await getInspectionAreaById(id);
    res.status(200).json({
      success: true,
      message: "Inspection Area reordered successfully",
      data: updatedInspectionArea,
    });
  } catch (error: any) {
    console.error("update InspectionArea error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Read stations Inspection Areas
// export const getStationsInspectionAreasController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         error: "InspectionArea ID is required",
//       });
//     }

//     const stations = await getStationsFromInspectionAreas(id);

//     res.status(200).json({
//       success: true,
//       data: stations,
//     });
//   } catch (error: any) {
//     console.error("Get inspection area error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// Update Inspection Areas
export const updateInspectionAreasController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!id || !name) {
      return res.status(400).json({
        success: false,
        message: "Inspection ID, name and order are required",
      });
    }

    const inspectionArea = await updateInspectionArea(id, { name });
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
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Inspection ID is required",
      });
    }
    await deleteInspectionArea(id);
    res.status(200).json({
      success: true,
      message: "Inspection Area deleted successfully",
    });
  } catch (error: any) {
    console.error("Update inspection area error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
