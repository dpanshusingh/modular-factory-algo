import { Request, Response, NextFunction } from 'express';
import { auth, firestore as db } from '../utils/firebase';
import { ApiResponse } from '../types/@server';
import { CustomError } from '../types/customErrorInterface';
import { validateCreateEmployee } from '../utils/validators/employeeValidator';

export const USERS_COLLECTION = 'users';

export const createEmployeeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = await validateCreateEmployee(req.body);
    const newUserRef = await db.collection(USERS_COLLECTION).add({
      ...validatedData,
      create_date: new Date(),
      update_date: new Date(),
    });

    const newUser = await newUserRef.get();

    const response: ApiResponse = {
      success: true,
      message: 'Employee created successfully',
      data: { id: newUserRef.id, ...newUser.data() },
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllEmployeesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const snapshot = await db.collection(USERS_COLLECTION).get();
    const employees = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Fetch auth user details for each employee's user_id
    const employeesWithAuthData = await Promise.all(
      employees.map(async (employee: any) => {
        try {
          const userRecord = await auth.getUser(employee.user_id);
          return {
            ...employee,
            auth: {
              uid: userRecord.uid,
              email: userRecord.email,
              emailVerified: userRecord.emailVerified,
              disabled: userRecord.disabled,
              lastSignInTime: userRecord.metadata.lastSignInTime,
              creationTime: userRecord.metadata.creationTime,
              providerData: userRecord.providerData,
            },
          };
        } catch (error) {
          // If user not found in Auth, still return employee data
          return { ...employee, auth: null };
        }
      })
    );

    const response: ApiResponse = {
      success: true,
      message: 'Employees retrieved successfully',
      data: employeesWithAuthData,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const docRef = db.collection(USERS_COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      const error: CustomError = new Error('Employee not found');
      error.status = 404;
      throw error;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Employee retrieved successfully',
      data: { id: doc.id, ...doc.data() },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeByEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    const snapshot = await db.collection(USERS_COLLECTION).where('email', '==', email).get();

    if (snapshot.empty) {
      const error: CustomError = new Error('Employee not found');
      error.status = 404;
      throw error;
    }

    const employee = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0];

    const response: ApiResponse = {
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const docRef = db.collection(USERS_COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      const error: CustomError = new Error('Employee not found');
      error.status = 404;
      throw error;
    }

    await docRef.update({
      ...req.body,
      update_date: new Date(),
    });

    const updatedDoc = await docRef.get();

    const response: ApiResponse = {
      success: true,
      message: 'Employee updated successfully',
      data: { id: updatedDoc.id, ...updatedDoc.data() },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteEmployeeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await db.collection(USERS_COLLECTION).doc(id).delete();

    const response: ApiResponse = {
      success: true,
      message: 'Employee deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getEmployeesByCrewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { crewId } = req.params;

    if (!crewId || crewId.trim() === '') {
      const error: CustomError = new Error('Invalid crew ID');
      error.status = 400;
      throw error;
    }

    const snapshot = await db
      .collection(USERS_COLLECTION)
      .where('lead_type_ids', 'array-contains', crewId)
      .get();

    const employees = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const response: ApiResponse = {
      success: true,
      message: 'Employees retrieved successfully',
      data: employees,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
