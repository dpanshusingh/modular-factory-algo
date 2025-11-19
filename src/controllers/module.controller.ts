import { Request, Response } from "express";
import {
  createModule,
  getAllModule,
  GetByIdModule,
  UpdateModule,
  getAllModuleCount,
  DeleteModule,
} from "../queries/module.query";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "crypto";

// Create module
export const createModuleController = async (req: Request, res: Response) => {
  try {
    const { moduleProfileId, travelerId, travelerTemplateId } = req.body;
    const id = uuidv4();
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    const serialNumber = `${year}+${month}+${randomNumber}`;
    const orderCount = await getAllModuleCount();
    const order = orderCount + 1;
    const module = await createModule({
      id,
      moduleProfileId,
      travelerId,
      travelerTemplateId,
      order,
      serialNumber,
    });

    res.status(201).json({
      success: true,
      message: "module created successfully",
      data: module,
    });
  } catch (error: any) {
    console.error("Create module error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Read module
export const getAllModuleController = async (req: Request, res: Response) => {
  try {
    const module = await getAllModule();
    res.status(200).json({
      success: true,
      data: module,
    });
  } catch (error: any) {
    console.error("Get module error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getByIdModuleController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "module Id is required",
      });
    }
    const data = await GetByIdModule(id);
    res.status(200).json({
      success: true,
      message: "module fetched successfully",
      data: data,
    });
  } catch (error: any) {
    console.error("get by Id module error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update module
export const updateModuleController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { moduleProfileId, travelerId, travelerTemplateId, order } = req.body;

    // Step 1: Update the record
    await UpdateModule(id, {
      moduleProfileId,
      travelerId,
      travelerTemplateId,
      order,
    });

    // Step 2: Fetch the updated record
    const updatedModule = await GetByIdModule(id);

    res.status(200).json({
      success: true,
      message: "Successfully updated the Module",
      data: updatedModule,
    });
  } catch (error: any) {
    console.error("Update module error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete module
export const deleteModuleeaController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "module ID is required",
      });
    }
    await DeleteModule(id);
    res.status(200).json({
      success: true,
      message: "module deleted successfully",
    });
  } catch (error: any) {
    console.error("delete module error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
