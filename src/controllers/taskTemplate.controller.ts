import { createTaskTemplate, deleteTaskTemplate, getAllTaskTemplates, getTaskTemplateById, TaskTemplateInput, updateTaskTemplate } from './../queries/taskTemplate.query';
import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";

// Create Task Template
export const createTaskTemplateController = async (req: Request, res: Response) => {
  try {
      const id = uuidv4();
      const order = 1;
    const input = {...req.body, id, order};

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

// Get All Task Templates
export const getAllTaskTemplatesController = async (_req: Request, res: Response) => {
  try {
    const taskTemplates = await getAllTaskTemplates();
    res.status(201).json(taskTemplates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Task Template
export const getTaskTemplateByIdController = async (req: Request, res: Response) => {
  try {
    const taskTemplate = await getTaskTemplateById(req.params.id);
    if (!taskTemplate) return res.status(404).json({ message: 'Not found' });
    res.status(201).json({success: true,data:taskTemplate});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Task Template
export const updateTaskTemplateController = async (req: Request, res: Response) => {
  try {
    const station = await updateTaskTemplate(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: "Template updated successfully",
      data: station,
    });
    
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Task Template
export const deleteTaskTemplateController = async (req: Request, res: Response) => {
  try {
    const taskTemplate = await deleteTaskTemplate(req.params.id);
    res.status(204).json({
        success: true,
        message: "Template deleted successfully",
        data: taskTemplate
    });
  } catch (error: any) {  
    res.status(500).json({ error: error.message });
  }
};
