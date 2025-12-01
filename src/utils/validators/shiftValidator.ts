import * as yup from "yup";

export const createShiftSchema = yup.object({
  body: yup.object({
    name: yup.string().required("Name is required"),
    startTime: yup.number().required("Start time is required"),
    endTime: yup.number().required("End time is required"),
    lunchStartTime: yup.number().required("Lunch start time is required"),
    lunchEndTime: yup.number().required("Lunch end time is required"),
  }),
});

export const updateShiftSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid("Invalid ID").required("Shift ID is required"),
  }),
  body: yup.object({
    name: yup.string().required("Name is required"),
    startTime: yup.number().required("Start time is required"),
    endTime: yup.number().required("End time is required"),
    lunchStartTime: yup.number().required("Lunch start time is required"),
    lunchEndTime: yup.number().required("Lunch end time is required"),
  }),
});

export const deleteShiftSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid("Invalid ID").required("Shift ID is required"),
  }),
});

export const getShiftByIdSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid("Invalid ID").required("Shift ID is required"),
  }),
});
