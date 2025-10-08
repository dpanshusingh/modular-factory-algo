import { Request, Response, NextFunction } from 'express';
import {
  createTimelog,
  getTimelogs,
  getTimelogsForExport,
  getTimelogById,
  updateTimelog,
  deleteTimelog,
  getTimelogsByEmployee,
  getFilteredTimelogs,
  getEmployeeFilteredTimeLogs
} from '../models/timelogModel';
import { validateCreateTimelog, validateTimelogFilters } from '../utils/validators/timelogValidator';
import { exportTimelogsToCSV, formatCSVResponse } from '../utils/csvExporter';
import { ApiResponse, Timelog, TimelogFilters } from '../types/@server';
import { CustomError } from '../types/customErrorInterface';

export const createTimelogController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = await validateCreateTimelog(req.body);
    const timelog = await createTimelog(validatedData);

    const response: ApiResponse<Timelog> = {
      success: true,
      message: 'Timelog created successfully',
      data: timelog,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};


export const filteredEmployeeTimelogController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { start, end, employee_id } = req.body;
    if (!start || !end || !employee_id) {
      res.status(401).json({
        success: false,
        message: "All fields are required",
      })
    }
    const filteredTimeLogs = await getEmployeeFilteredTimeLogs({
      start, end, employee_id
    })

    return res.status(200).json(
      {
        success: true,
        data: filteredTimeLogs
      }
    )

  } catch (error) {
    next(error);
  }
};


export const getTimelogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters: TimelogFilters = {
      start: req.query.start as string,
      end: req.query.end as string,
      employee_id: req.query.employee_id as string,
    };

    // Validate filters
    const validatedFilters = await validateTimelogFilters(filters);

    const timelogs = await getTimelogs(validatedFilters);

    const response: ApiResponse<Timelog[]> = {
      success: true,
      message: 'Timelogs retrieved successfully',
      data: timelogs,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getTimelogByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const timelogId = parseInt(id);

    if (isNaN(timelogId)) {
      const error: CustomError = new Error('Invalid timelog ID');
      error.status = 400;
      throw error;
    }

    const timelog = await getTimelogById(timelogId);

    if (!timelog) {
      const error: CustomError = new Error('Timelog not found');
      error.status = 404;
      throw error;
    }

    const response: ApiResponse<Timelog> = {
      success: true,
      message: 'Timelog retrieved successfully',
      data: timelog,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateTimelogController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const timelogId = parseInt(id);

    if (isNaN(timelogId)) {
      const error: CustomError = new Error('Invalid timelog ID');
      error.status = 400;
      throw error;
    }

    const timelog = await updateTimelog(timelogId, req.body);

    const response: ApiResponse<Timelog> = {
      success: true,
      message: 'Timelog updated successfully',
      data: timelog,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteTimelogController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const timelogId = parseInt(id);

    if (isNaN(timelogId)) {
      const error: CustomError = new Error('Invalid timelog ID');
      error.status = 400;
      throw error;
    }

    await deleteTimelog(timelogId);

    const response: ApiResponse = {
      success: true,
      message: 'Timelog deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getTimelogsByEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    if (!employeeId) {
      const error: CustomError = new Error('Employee ID is required');
      error.status = 400;
      throw error;
    }

    // Set default date range if not provided
    const end = endDate ? new Date(endDate as string) : new Date();
    const start = startDate ? new Date(startDate as string) : new Date();
    
    // If no start date provided, default to 30 days ago
    if (!startDate) {
      start.setDate(start.getDate() - 30);
    }

    // Use your existing function
    const timelogs = await getEmployeeFilteredTimeLogs({
      start: start,
      end: end,
      employee_id: employeeId
    });

    const response: ApiResponse<any[]> = {
      success: true,
      message: 'Timelogs retrieved successfully',
      data: timelogs,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const exportTimelogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters: TimelogFilters = {
      start: req.query.start as string,
      end: req.query.end as string,
      employee_id: req.query.employee_id as string,
    };

    // Validate filters
    const validatedFilters = await validateTimelogFilters(filters);

    const timelogs = await getTimelogsForExport(validatedFilters);

    if (timelogs.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'No timelogs found for the specified filters',
      };
      return res.status(404).json(response);
    }

    const csvContent = exportTimelogsToCSV(timelogs);
    const csvResponse = formatCSVResponse(csvContent, 'timelogs');

    res.set(csvResponse.headers);
    res.send(csvResponse.content);
  } catch (error) {
    next(error);
  }
};


export const getTimelogsFilterController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { start, end } = req.params;
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end query parameters are required" });
    }
    const timelogs = await getFilteredTimelogs(start as string, end as string);
    return res.status(200).json({ data: timelogs });
  } catch (error) {
    next(error);
  }
};