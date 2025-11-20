import * as yup from "yup";
import { CreatePtoRequest } from "../../types/@server";

export const createPtoSchema = yup.object().shape({
  employeeId: yup.string().required("employee Id is required"),
  employeeName: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("employee Name is required"),
  ptoType: yup.string().required("ptoType is required"),
  ptoStatus: yup.string().required("ptoStatus is required"),
  ptoHours: yup.number().required("passcode is required"),
  ptoNotes: yup.string().optional(),
  startDate: yup
    .date()
    .min(1, "At least one crew must be assigned")
    .required("Crews are required"),
  endDate: yup
    .date()
    .min(1, "At least one crew must be assigned")
    .required("Crews are required"),
});

export const validateCreatePTO = async (data: CreatePtoRequest) => {
  try {
    return await createPtoSchema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.errors.join(", "));
    }
    throw error;
  }
};
