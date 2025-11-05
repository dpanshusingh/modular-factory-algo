// controllers/data_connect/projectController.ts
import { Request, Response, NextFunction } from "express";
import { dataConnect } from "../../config/dataConnectClient";
import { CREATE_PROJECT, DELETE_PROJECT, GET_PROJECTS, UPDATE_PROJECT } from "../../queries/project.query";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    const result = await dataConnect.executeGraphql(CREATE_PROJECT, {
      variables: { 
        name,
      },
    });

    res.status(201).json({
        data:result
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;

    const result = await dataConnect.executeGraphql(GET_PROJECTS,{
        variables: { user_id }
    });

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !name) {
      return res.status(400).json({
        success: false,
        message: "Project ID and name are required",
      });
    }

    const result = await dataConnect.executeGraphql(UPDATE_PROJECT,{
      variables: { id, name },
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const result = await dataConnect.executeGraphql(DELETE_PROJECT,{
      variables: { id },
    });

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};