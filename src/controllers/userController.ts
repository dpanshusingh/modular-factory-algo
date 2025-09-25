import { Request, Response, NextFunction } from 'express';
import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  getUserByRole, 
  updateUser, 
  deleteUser 
} from '../models/userModel';
import { validateCreateUser } from '../utils/validators/userValidator';
import { ApiResponse, User } from '../types/@server';
import { CustomError } from '../types/customErrorInterface';

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('createUserController body', req.body);
    const validatedData = await validateCreateUser(req.body);
   
    const user = await createUser(validatedData);
    
    const response: ApiResponse<User> = {
      success: true,
      message: 'User created successfully',
      data: user,
    };
    
    res.status(201).json(response); 
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    
    const response: ApiResponse<User[]> = {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      const error: CustomError = new Error('Invalid user ID');
      error.status = 400;
      throw error;
    }
    
    const user = await getUserById(userId);
    
    if (!user) {
      const error: CustomError = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    const response: ApiResponse<User> = {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUsersByRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.params;
    const users = await getUserByRole(role);
    
    const response: ApiResponse<User[]> = {
      success: true,
      message: `Users with role '${role}' retrieved successfully`,
      data: users,
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      const error: CustomError = new Error('Invalid user ID');
      error.status = 400;
      throw error;
    }
    
    const user = await updateUser(userId, req.body);
    
    const response: ApiResponse<User> = {
      success: true,
      message: 'User updated successfully',
      data: user,
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      const error: CustomError = new Error('Invalid user ID');
      error.status = 400;
      throw error;
    }
    
    await deleteUser(userId);
    
    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
