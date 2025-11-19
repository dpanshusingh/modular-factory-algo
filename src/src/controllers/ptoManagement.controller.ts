import { firestore as db, authAdmin } from "../utils/firebase";
import { ApiResponse } from "../types/@server";
import { CustomError } from "../types/customErrorInterface";
import { Request, Response, NextFunction } from "express";
import { validateCreatePTO } from "../utils/validators/ptoValidator";
import { attachAuthToUser } from "../models/timelogModel";
import { PTOstatus } from "../types/@server"; // <-- make sure this path is correct

export const PTOS_COLLECTION = "ptoManagement";

export const createPtoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("req.body", req.body);
    const validatedData = await validateCreatePTO(req.body);

    const newPtoRef = db.collection(PTOS_COLLECTION).doc();
    await newPtoRef.set({
      ...validatedData,
      create_date: new Date(),
      update_date: new Date(),
      document_id: newPtoRef.id, // ✅ store document_id
      time_log: {
        log_entries: [],
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "PTO created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllPTO = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const snapshot = await db.collection(PTOS_COLLECTION).get();

    const allPTO = snapshot.docs.map((doc) => ({
      document_id: doc.id,
      ...doc.data(),
    }));

    const response: ApiResponse = {
      success: true,
      message: "All PTO fetched successfully",
      data: allPTO,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getPtoByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const docSnap = await db.collection(PTOS_COLLECTION).doc(id).get();
    if (!docSnap.exists) {
      const error: CustomError = new Error("PTO not found");
      error.status = 404;
      throw error;
    }

    const PTOData = { document_id: docSnap.id, ...(docSnap.data() as any) };
    const enrichedPTO = await attachAuthToUser(PTOData);

    const response: ApiResponse = {
      success: true,
      message: "PTO retrieved successfully",
      data: enrichedPTO,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updatePtoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const docRef = db.collection(PTOS_COLLECTION).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      const error: CustomError = new Error("PTO not found");
      error.status = 404;
      throw error;
    }

    await docRef.update({
      ...req.body,
      update_date: new Date(),
    });

    const updatedSnap = await docRef.get();
    const userData = {
      document_id: updatedSnap.id,
      ...(updatedSnap.data() as any),
    };
    const enrichedUser = await attachAuthToUser(userData);

    const response: ApiResponse = {
      success: true,
      message: "PTO updated successfully",
      data: enrichedUser,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updatePendingPtoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const docRef = db.collection(PTOS_COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      const error: CustomError = new Error("PTO not found");
      error.status = 404;
      throw error;
    }

    await docRef.update({
      ptoStatus: PTOstatus.Pending,
      update_date: new Date(),
    });

    const updatedSnap = await docRef.get();
    const userData = {
      document_id: updatedSnap.id,
      ...(updatedSnap.data() as any),
    };
    const enrichedUser = await attachAuthToUser(userData);

    res.status(200).json({
      success: true,
      message: "PTO marked as Pending",
      data: enrichedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApprovedPtoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const docRef = db.collection(PTOS_COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      const error: CustomError = new Error("PTO not found");
      error.status = 404;
      throw error;
    }

    await docRef.update({
      ptoStatus: PTOstatus.Approved,
      update_date: new Date(),
    });

    const updatedSnap = await docRef.get();
    const userData = {
      document_id: updatedSnap.id,
      ...(updatedSnap.data() as any),
    };
    const enrichedUser = await attachAuthToUser(userData);

    res.status(200).json({
      success: true,
      message: "PTO approved successfully",
      data: enrichedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRejectedPtoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const docRef = db.collection(PTOS_COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      const error: CustomError = new Error("PTO not found");
      error.status = 404;
      throw error;
    }

    await docRef.update({
      ptoStatus: PTOstatus.Rejected,
      update_date: new Date(),
    });

    const updatedSnap = await docRef.get();
    const userData = {
      document_id: updatedSnap.id,
      ...(updatedSnap.data() as any),
    };
    const enrichedUser = await attachAuthToUser(userData);

    res.status(200).json({
      success: true,
      message: "PTO rejected successfully",
      data: enrichedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePtoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await db.collection(PTOS_COLLECTION).doc(id).delete();

    const response: ApiResponse = {
      success: true,
      message: "PTO deleted successfully",
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
