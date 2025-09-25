import { Request, Response, NextFunction } from 'express';
import { 
  createEmployee, 
  getAllEmployees, 
  getEmployeeById, 
  getEmployeeByEmail,
  updateEmployee, 
  deleteEmployee,
  getEmployeesByCrew
} from '../models/employeeModel';
import { validateCreateEmployee } from '../utils/validators/employeeValidator';
import { ApiResponse, Employee } from '../types/@server';
import { CustomError } from '../types/customErrorInterface';

export const createEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = await validateCreateEmployee(req.body);
    // Ensure crews array contains only strings
    const employeeData = {
      ...validatedData,
      crews: validatedData.crews.filter((crew): crew is string => typeof crew === 'string')
    };
    const employee = await createEmployee(employeeData);
    
    const response: ApiResponse<Employee> = {
      success: true,
      message: 'Employee created successfully',
      data: employee,
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllEmployeesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employees = await getAllEmployees();
    
    const response: ApiResponse<Employee[]> = {
      success: true,
      message: 'Employees retrieved successfully',
      data: employees,
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const employeeId = parseInt(id);
    
    if (isNaN(employeeId)) {
      const error: CustomError = new Error('Invalid employee ID');
      error.status = 400;
      throw error;
    }
    
    const employee = await getEmployeeById(employeeId);
    
    if (!employee) {
      const error: CustomError = new Error('Employee not found');
      error.status = 404;
      throw error;
    }
    
    const response: ApiResponse<Employee> = {
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeByEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const employee = await getEmployeeByEmail(email);
    
    if (!employee) {
      const error: CustomError = new Error('Employee not found');
      error.status = 404;
      throw error;
    }
    
    const response: ApiResponse<Employee> = {
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const employeeId = parseInt(id);
    
    if (isNaN(employeeId)) {
      const error: CustomError = new Error('Invalid employee ID');
      error.status = 400;
      throw error;
    }
    
    const employee = await updateEmployee(employeeId, req.body);
    
    const response: ApiResponse<Employee> = {
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const employeeId = parseInt(id);
    
    if (isNaN(employeeId)) {
      const error: CustomError = new Error('Invalid employee ID');
      error.status = 400;
      throw error;
    }
    
    await deleteEmployee(employeeId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Employee deleted successfully',
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getEmployeesByCrewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { crewId } = req.params;
    
    if (!crewId || crewId.trim() === '') {
      const error: CustomError = new Error('Invalid crew ID');
      error.status = 400;
      throw error;
    }
    
    const employees = await getEmployeesByCrew(crewId);
    
    const response: ApiResponse<Employee[]> = {
      success: true,
      message: 'Employees retrieved successfully',
      data: employees,
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};