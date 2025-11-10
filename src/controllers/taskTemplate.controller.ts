import { createTaskTemplate, TaskTemplateInput } from './../queries/taskTemplate.query';
import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";
import { createStation, deleteStation, getAllStations, getStationById, updateStation } from "../queries/station.query";

// Create Station
export const createTaskTemplateController = async (req: Request, res: Response) => {
  try {
      const id = uuidv4();
    const input = {...req.body, id};

    const taskTemplate = await createTaskTemplate(input);

    res.status(201).json({
      success: true,
      message: "Task Template created successfully",
      data: taskTemplate,
    });
  } catch (error: any) {
    console.error("Create task template error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
