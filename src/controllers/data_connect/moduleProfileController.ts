import { NextFunction, Request, Response } from "express";
import { dataConnect } from "../../config/dataConnectClient";
import {
  CREATE_MODULEPROFILE,
  GET_MODULEPROFILES,
} from "../../queries/moduleProfile.query";
import { ApiResponse, CreateModuleProfileRequest } from "../../types/@server";

export const createModuleProfile = async (
  req: Request<{}, {}, CreateModuleProfileRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name} = req.body;
    // const id = crypto.randomUUID();
    if (name && typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "name must be a string",
      });
    }

    const result = await dataConnect.executeGraphql(CREATE_MODULEPROFILE, {
      variables: {
        id,
        name
      },
    });

    const response: ApiResponse = {
          success: true,
          message: 'ModuleProfile created successfully',
          data: result.data,
        };
    res.status(200).json(response)
  } catch (error) {
    next(error);
  }
};

export const getModuleProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;

    const result = await dataConnect.executeGraphql(GET_MODULEPROFILES, {
      variables: { user_id },
    });

    const response: ApiResponse = {
          success: true,
          message: 'ModuleProfile created successfully',
          data: result.data,
        };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
