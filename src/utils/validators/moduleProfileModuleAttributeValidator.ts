import * as yup from "yup";

export const createmoduleProfileModuleAttributeSchema = yup.object({
  body: yup.object({
    moduleProfileId: yup
      .string()
      .uuid("Invalid Module Profile ID ")
      .required("Module Profile ID is required"),
    moduleAttributeId: yup
      .string()
      .uuid("Invalid Module Profile Module Attribute ID")
      .required("Module Profile Module Attribute ID is required"),
    value: yup
      .string()
      .uuid("Invalid Module Profile Module Attribute Value")
      .required("Module Profile Module Attribute Value is required"),
  }),
});

export const getmoduleProfileModuleAttributeIdSchema = yup.object({
  params: yup.object({
    id: yup
      .string()
      .uuid("Invalid Module Profile Module Attribute ID")
      .required("Module Profile Module Attribute ID is required"),
  }),
});

export const updatemoduleProfileModuleAttributeSchema = yup.object({
  params: yup.object({
    id: yup.string().required("Module Profile Module Attribute ID is required"),
  }),
  body: yup.object({
    moduleProfileId: yup
      .string()
      .uuid("Invalid Module Profile ID ")
      .required("Module Profile ID is required"),
    moduleAttributeId: yup
      .string()
      .uuid("Invalid Module Profile Module Attribute ID")
      .required("Module Profile Module Attribute ID is required"),
    value: yup
      .string()
      .uuid("Invalid Module Profile Module Attribute Value")
      .required("Module Profile Module Attribute Value is required"),
  }),
});

export const deletemoduleProfileModuleAttributeSchema = yup.object({
  params: yup.object({
    id: yup.string().required("Module Profile Module Attribute ID is required"),
  }),
});
