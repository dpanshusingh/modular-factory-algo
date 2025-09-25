import * as yup from 'yup';
import { CreateEmployeeRequest } from '../../types/@server';

export const createEmployeeSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Must be a valid email')
    .optional(),
  crews: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one crew must be assigned')
    .required('Crews are required'),
});

export const validateCreateEmployee = async (data: CreateEmployeeRequest) => {
  try {
    return await createEmployeeSchema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.errors.join(', '));
    }
    throw error;
  }
};
