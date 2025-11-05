import { CreateModuleProfileRequest } from "../../types/@server";

export const validateCreateModuleProfile = (
  body: any
): { valid: boolean; message?: string } => {
  // Check if body exists
  if (!body) {
    return { valid: false, message: "Request body is missing" };
  }

  // ✅ Validate projectId
  if (typeof body.projectId !== "number") {
    return { valid: false, message: "projectId must be a number" };
  }

  // ✅ Validate name (optional, but must be string if provided)
  if (body.name !== undefined && typeof body.name !== "string") {
    return { valid: false, message: "name must be a string" };
  }

  return { valid: true };
};
