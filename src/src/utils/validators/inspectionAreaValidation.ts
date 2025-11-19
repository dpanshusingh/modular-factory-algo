import * as yup from "yup";

export const createInspectionAreaSchema = yup.object({
  body: yup.object({
    name: yup.string().required("Name is required"),
    order: yup
      .number()
      .integer("Order must be an integer")
      .required("Order is required"),
  }),
});

export const updateInspectionAreaSchema = yup.object({
  name: yup.string().required("Name is required"),
  order: yup
    .number()
    .integer("Order must be an integer")
    .required("Order is required"),
});

export const deleteInspectionAreaSchema = yup.object({
  id: yup.string().uuid("Invalid ID format").required("ID is required"),
});
