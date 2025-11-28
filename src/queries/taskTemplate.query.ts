import { dataConnect } from "../config/dataConnectClient";

type Int = number & { __int__: void };

function toInt(n: number): Int {
  if (!Number.isInteger(n)) {
    throw new Error("Value is not an integer");
  }
  return n as Int;
}

export type LeadType =
  | "closeup"
  | "drywall"
  | "electrical"
  | "exterior"
  | "floors"
  | "hvac"
  | "insulation"
  | "interior"
  | "office"
  | "paint"
  | "plumbing"
  | "roofing"
  | "shipping"
  | "walls";

export type Skill =
  | "framing"
  | "finishCarpentry"
  | "electricalTrim"
  | "electricalRough"
  | "plumbing"
  | "drywallHanging"
  | "drywallMud"
  | "texture"
  | "painting"
  | "roofing"
  | "flooring"
  | "boxMoving"
  | "cutting"
  | "hvac";

export interface TaskTemplateInput {
  id: string;
  isPhotoRequired: boolean;
  isVideoRequired: boolean;
  leadType: LeadType;
  maxWorkers: Int;
  minWorkers: Int;
  name: string;
  order: Int;
  rankedSkills: Skill[];
  stationId: string;
}

export const createTaskTemplate = async (input: TaskTemplateInput) => {
  const query = `
    mutation CreateTaskTemplate(
      $id: String!
      $isPhotoRequired: Boolean!
      $isVideoRequired: Boolean!
      $departmentId: String!
      $maxWorkers: Int!
      $minWorkers: Int!
      $name: String!
      $order: Int!
      $rankedSkills: [Skill!]
      $stationId: String!
      $description:String
      $prerequisiteTaskTemplateId:String
    ) {
      taskTemplate_insert(
        data: {
          id: $id
          isPhotoRequired: $isPhotoRequired
          isVideoRequired: $isVideoRequired
          departmentId: $departmentId
          maxWorkers: $maxWorkers
          minWorkers: $minWorkers
          name: $name
          order: $order
          rankedSkills: $rankedSkills
          station: { id: $stationId }
          description:$description
          prerequisiteTaskTemplateId:$prerequisiteTaskTemplateId
        }
      )
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

// Read all
export const getAllTaskTemplates = async () => {
  const query = `
    query {
      taskTemplates {
        id
        isPhotoRequired
        isVideoRequired
        maxWorkers
        minWorkers
        description
        department{id name}
        prerequisiteTaskTemplateId
        name
        order
        rankedSkills
        station { 
          id
          doesReceiveTravelers
          order
          name
          inspectionArea { id name order}
        }
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Read one
export const getTaskTemplateById = async (id: string) => {
  const query = `
    query GetTaskTemplateById($id: String!) {
      taskTemplate(id: $id){
        id
        isPhotoRequired
        isVideoRequired
        maxWorkers
        minWorkers
        name
        order
        rankedSkills
        station { 
          id
          doesReceiveTravelers
          order
          name
          inspectionArea { id name order}
        }
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};

export const countTaskTemplate = async () => {
  const query = `
    query CountTaskTemplates {
      taskTemplates {
        _count
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  const count = (response.data as any)?.taskTemplates?.[0]?._count ?? 0;
  return count;
};

// Update
export const updateTaskTemplate = async (
  id: string,
  input: Partial<TaskTemplateInput>
) => {
  const query = `
mutation UpdateTaskTemplate(
      $id: String!
      $isPhotoRequired: Boolean!
      $isVideoRequired: Boolean!
      $departmentId: String!
      $maxWorkers: Int!
      $minWorkers: Int!
      $name: String!
      $order: Int!
      $rankedSkills: [Skill!]
      $stationId: String!
      $description:String
      $prerequisiteTaskTemplateId:String
       
) {
    taskTemplate_update(
        id: $id
        data: {
          isPhotoRequired: $isPhotoRequired
          isVideoRequired: $isVideoRequired
          departmentId: $departmentId
          maxWorkers: $maxWorkers
          minWorkers: $minWorkers
          name: $name
          order: $order
          rankedSkills: $rankedSkills
          station: { id: $stationId }
          description:$description
          prerequisiteTaskTemplateId:$prerequisiteTaskTemplateId
        }
    )
}
`;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id, ...input },
  });

  return response.data;
};

// Delete
export const deleteTaskTemplate = async (id: string) => {
  const query = `
    mutation DeleteTaskTemplate($id: String!) {
        taskTemplate_delete(id: $id)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};
