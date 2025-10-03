import * as yup from 'yup';
import { CreateUserRequest } from '../../types/@server';

export const createUserSchema = yup.object().shape({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  firstname: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastname: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  role: yup
    .string()
    .oneOf(['admin', 'user', 'manager'], 'Role must be one of: admin, user, manager')
    .required('Role is required'),
});

export const validateCreateUser = async (data: CreateUserRequest) => {
  try {
    return await createUserSchema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.errors.join(', '));
    }
    throw error;
  }
};
