import * as yup from "yup";

const leadTypes = [
  "closeup", "drywall", "electrical", "exterior", "floors", "hvac",
  "insulation", "interior", "office", "paint", "plumbing", "roofing",
  "shipping", "walls"
] as const;

const moduleCharacteristicTypes = [
  "squareFeet", "linearFeetExteriorWalls", "linearFeetInteriorWalls",
  "countInteriorWalls", "countToilets", "countSinks", "countWindows",
  "countExteriorDoors", "countInteriorDoors", "squareFeetExteriorCloseUp",
  "squareFeetRoofing", "linearFeetCabinets", "countElectricalTerminals",
  "linearFeetFirewall", "countStairs", "hasHvacDucting"
] as const;

const skills = [
  "framing", "finishCarpentry", "electricalTrim", "electricalRough", "plumbing",
  "drywallHanging", "drywallMud", "texture", "painting", "roofing", "flooring",
  "boxMoving", "cutting", "hvac"
] as const;

// ✅ Create
export const createTaskTemplateSchema = yup.object({
  body: yup.object({
    isPhotoRequired: yup.boolean().required("isPhotoRequired is required"),
    isVideoRequired: yup.boolean().required("isVideoRequired is required"),
    leadType: yup
      .mixed<typeof leadTypes[number]>()
      .oneOf(leadTypes)
      .required("leadType is required"),
    maxWorkers: yup
      .number()
      .integer("maxWorkers must be an integer")
      .required("maxWorkers is required"),
    minWorkers: yup
      .number()
      .integer("minWorkers must be an integer")
      .required("minWorkers is required"),
    moduleCharacteristicType: yup
      .mixed<typeof moduleCharacteristicTypes[number]>()
      .oneOf(moduleCharacteristicTypes)
      .required("moduleCharacteristicType is required"),
    name: yup.string().required("name is required"),
    order: yup
      .number()
      .integer("order must be an integer")
      .required("order is required"),
    rankedSkills: yup
      .array()
      .of(yup.mixed<typeof skills[number]>().oneOf(skills))
      .required("rankedSkills are required"),
    stationId: yup.string().uuid("Invalid stationId").required("stationId is required"),
  }),
});

// ✅ Update
export const updateTaskTemplateSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid("Invalid ID").required("TaskTemplate ID is required"),
  }),
  body: yup.object({
    isPhotoRequired: yup.boolean().required(),
    isVideoRequired: yup.boolean().required(),
    leadType: yup.mixed<typeof leadTypes[number]>().oneOf(leadTypes).required(),
    maxWorkers: yup.number().integer().required(),
    minWorkers: yup.number().integer().required(),
    moduleCharacteristicType: yup
      .mixed<typeof moduleCharacteristicTypes[number]>()
      .oneOf(moduleCharacteristicTypes)
      .required(),
    name: yup.string().required(),
    order: yup.number().integer().required(),
    rankedSkills: yup
      .array()
      .of(yup.mixed<typeof skills[number]>().oneOf(skills))
      .required(),
    stationId: yup.string().uuid().required(),
  }),
});

// ✅ Get by ID
export const getTaskTemplateByIdSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid("Invalid ID").required("TaskTemplate ID is required"),
  }),
});

// ✅ Delete
export const deleteTaskTemplateSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid("Invalid ID").required("TaskTemplate ID is required"),
  }),
});
