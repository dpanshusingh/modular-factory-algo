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

export const getTaskTemplatesGroupedByStation = async () => {
  const query = `
    query GetTaskTemplates {
      taskTemplates(
        orderBy: [
          { station: { order: ASC } }
          { order: ASC }
        ]
      ) {
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
          name
          order
          doesReceiveTravelers
          inspectionArea { 
            id 
            name 
            order
          }
        }
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query);

  // Cast the data to a string-indexed object
  const data = response.data as Record<string, any[]>;

  // Get first key returned from GraphQL
  const rootKey = Object.keys(data)[0];

  const templates = data[rootKey] || [];

  // Group by station.id
  const grouped = templates.reduce((acc: any, item: any) => {
    const stationId = item.station.id;
    if (!acc[stationId]) acc[stationId] = [];
    acc[stationId].push(item);
    return acc;
  }, {});

  return grouped;
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


export const countTaskTemplate = async (stationId: string) => {
  if (!stationId) {
    throw new Error("stationId is required but was missing/undefined");
  }

  const query = `
    query CountTaskTemplates($stationId: String!) {
      taskTemplates(
        where: { station: { id: { eq: $stationId } } }
      ) {
        id
      }
    }
  `;


  const response = await dataConnect.executeGraphql<
    { taskTemplates: { id: string }[] },
    { stationId: string }
  >(query, {
    variables: { stationId: stationId }, // explicit
  });

  return response.data?.taskTemplates.length ?? 0;
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

export const updateTaskTemplateOrder = async (id: string, order: number) => {
  const query = `
  mutation UpdateTaskTemplate($id: String!, $order: Int!) {
    taskTemplate_update(
      key: { id: $id }
      data: { order: $order }
    )
  }
`;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id, order },
  });
  return response.data ?? null;
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
