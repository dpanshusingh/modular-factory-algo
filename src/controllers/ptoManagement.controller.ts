// import { firestore as db, authAdmin } from "../utils/firebase";
import {
  createPtoRequest,
  getPtoCount,
  getPtoRequests,
  updatePtoRequest,
} from "../queries/ptoManagement.query";
import { Request, Response, NextFunction } from "express";
import { validateUpdatePTO } from "../utils/validators/ptoValidator";
// import { ApiResponse } from "../types/@server";
// import { CustomError } from "../types/customErrorInterface";
// import { validateCreatePTO } from "../utils/validators/ptoValidator";
// import { attachAuthToUser } from "../models/timelogModel";
// import { PTOstatus } from "../types/@server"; // <-- make sure this path is correct
// export const PTOS_COLLECTION = "ptoManagement";

export const createPtoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("req.body #createPtoController:", req.body);
    const validatedInput = await validateUpdatePTO(req.body);
    const ptoId = String(Math.floor(Date.now() / 1000));
    const dataPayload = {
      ...validatedInput,
      id: ptoId,
      hoursRequested: Number(validatedInput.hoursRequested),
    };

    const response = await createPtoRequest(dataPayload);
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
    const DEFAULT_OFFSET = 0;
    const DEFAULT_LIMIT = 20;
    const offset = parseInt(req.query.offset as string) || DEFAULT_OFFSET;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
    const result = await getPtoRequests({ limit, offset });
    if (!result) {
      return res
        .status(404)
        .json({ success: true, message: "No PTO requests found.", data: [] });
    }
    const response = {
      success: true,
      message: "PTO Requests fetched successfully with user details.",
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updatePtoRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ptoId = parseInt(req.params.id, 10);
    if (isNaN(ptoId)) {
      throw new Error(
        "Invalid PTO Request ID provided. ID must be an integer."
      );
    }
    const { startDate, endDate, status, type, hoursRequested, note } = req.body;
    const ptoUpdateData: any = { id: ptoId };
    if (startDate) ptoUpdateData.startDate = startDate;
    if (endDate) ptoUpdateData.endDate = endDate;
    if (status) ptoUpdateData.status = status;
    if (type) ptoUpdateData.type = type;
    if (hoursRequested) ptoUpdateData.hoursRequested = hoursRequested;
    if (note) ptoUpdateData.note = note;

    const ptoRequest = await updatePtoRequest(ptoUpdateData);

    const response = {
      success: true,
      message: `PTO Request ID ${ptoId} updated successfully.`,
      data: ptoRequest,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// This code has been commented out because it was using Firestore.
// Our project has now migrated to Data Connect.

// export const createPtoController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     console.log("req.body", req.body);
//     const validatedData = await validateCreatePTO(req.body);

//     const newPtoRef = db.collection(PTOS_COLLECTION).doc();
//     await newPtoRef.set({
//       ...validatedData,
//       create_date: new Date(),
//       update_date: new Date(),
//       document_id: newPtoRef.id, // ✅ store document_id
//       time_log: {
//         log_entries: [],
//       },
//     });

//     const response: ApiResponse = {
//       success: true,
//       message: "PTO created successfully",
//     };

//     res.status(201).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAllPTO = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const snapshot = await db.collection(PTOS_COLLECTION).get();

//     const allPTO = snapshot.docs.map((doc) => ({
//       document_id: doc.id,
//       ...doc.data(),
//     }));

//     const response: ApiResponse = {
//       success: true,
//       message: "All PTO fetched successfully",
//       data: allPTO,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getPtoByIdController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;

//     const docSnap = await db.collection(PTOS_COLLECTION).doc(id).get();
//     if (!docSnap.exists) {
//       const error: CustomError = new Error("PTO not found");
//       error.status = 404;
//       throw error;
//     }

//     const PTOData = { document_id: docSnap.id, ...(docSnap.data() as any) };
//     const enrichedPTO = await attachAuthToUser(PTOData);

//     const response: ApiResponse = {
//       success: true,
//       message: "PTO retrieved successfully",
//       data: enrichedPTO,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updatePtoController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;

//     const docRef = db.collection(PTOS_COLLECTION).doc(id);
//     const docSnap = await docRef.get();
//     if (!docSnap.exists) {
//       const error: CustomError = new Error("PTO not found");
//       error.status = 404;
//       throw error;
//     }

//     await docRef.update({
//       ...req.body,
//       update_date: new Date(),
//     });

//     const updatedSnap = await docRef.get();
//     const userData = {
//       document_id: updatedSnap.id,
//       ...(updatedSnap.data() as any),
//     };
//     const enrichedUser = await attachAuthToUser(userData);

//     const response: ApiResponse = {
//       success: true,
//       message: "PTO updated successfully",
//       data: enrichedUser,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updatePendingPtoController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;

//     const docRef = db.collection(PTOS_COLLECTION).doc(id);
//     const docSnap = await docRef.get();

//     if (!docSnap.exists) {
//       const error: CustomError = new Error("PTO not found");
//       error.status = 404;
//       throw error;
//     }

//     await docRef.update({
//       ptoStatus: PTOstatus.Pending,
//       update_date: new Date(),
//     });

//     const updatedSnap = await docRef.get();
//     const userData = {
//       document_id: updatedSnap.id,
//       ...(updatedSnap.data() as any),
//     };
//     const enrichedUser = await attachAuthToUser(userData);

//     res.status(200).json({
//       success: true,
//       message: "PTO marked as Pending",
//       data: enrichedUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateApprovedPtoController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;

//     const docRef = db.collection(PTOS_COLLECTION).doc(id);
//     const docSnap = await docRef.get();

//     if (!docSnap.exists) {
//       const error: CustomError = new Error("PTO not found");
//       error.status = 404;
//       throw error;
//     }

//     await docRef.update({
//       ptoStatus: PTOstatus.Approved,
//       update_date: new Date(),
//     });

//     const updatedSnap = await docRef.get();
//     const userData = {
//       document_id: updatedSnap.id,
//       ...(updatedSnap.data() as any),
//     };
//     const enrichedUser = await attachAuthToUser(userData);

//     res.status(200).json({
//       success: true,
//       message: "PTO approved successfully",
//       data: enrichedUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateRejectedPtoController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;

//     const docRef = db.collection(PTOS_COLLECTION).doc(id);
//     const docSnap = await docRef.get();

//     if (!docSnap.exists) {
//       const error: CustomError = new Error("PTO not found");
//       error.status = 404;
//       throw error;
//     }

//     await docRef.update({
//       ptoStatus: PTOstatus.Rejected,
//       update_date: new Date(),
//     });

//     const updatedSnap = await docRef.get();
//     const userData = {
//       document_id: updatedSnap.id,
//       ...(updatedSnap.data() as any),
//     };
//     const enrichedUser = await attachAuthToUser(userData);

//     res.status(200).json({
//       success: true,
//       message: "PTO rejected successfully",
//       data: enrichedUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deletePtoController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;

//     await db.collection(PTOS_COLLECTION).doc(id).delete();

//     const response: ApiResponse = {
//       success: true,
//       message: "PTO deleted successfully",
//     };
//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };
