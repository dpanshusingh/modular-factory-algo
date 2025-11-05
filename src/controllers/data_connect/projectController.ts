// controllers/data_connect/projectController.ts
import { Request, Response, NextFunction } from "express";
import { dataConnect } from "../../config/dataConnectClient";
import { CREATE_PROJECT, GET_PROJECTS } from "../../queries/project.query";

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


