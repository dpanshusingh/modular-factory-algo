import { dataConnect } from "../config/dataConnectClient";

interface taskTemplateModuleAttributeInput {
  taskTemplateId: string;
  moduleAttributeId: string;
}

// Create
export const createTaskTemplateModuleAttribute = async (
  input: taskTemplateModuleAttributeInput & { id: string }
) => {
  const query = `
    mutation CreateTaskTemplateModuleAttribute(
      $id: String!,
      $taskTemplateId: String!,
      $moduleAttributeId: String!
    ) {
      taskTemplateModuleAttribute_insert(
        data: { 
          id: $id, 
          taskTemplateId: $taskTemplateId,
          moduleAttributeId: $moduleAttributeId
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
export const getAllTaskTemplateModuleAttributes = async () => {
  const query = `
    query {
      taskTemplateModuleAttributes {
        id
        taskTemplate{
          id
        }
        moduleAttribute{
          id
          name
          moduleAttributeType
        }
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Read one
export const getTaskTemplateModuleAttributeById = async (id: string) => {
  const query = `
    query GetTaskTemplateModuleAttributeById($id: String!) {
      taskTemplateModuleAttribute(id: $id) {
        id
        taskTemplate{
          id
          name
        }
        moduleAttribute{
          id
          name
          moduleAttributeType
        }
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};

// Update
export const updateTaskTemplateModuleAttribute = async (
  id: string,
  input: Partial<taskTemplateModuleAttributeInput>
) => {
  const query = `
    mutation UpdateTaskTemplateModuleAttribute(
      $id: String!
      $taskTemplateId: String!
      $moduleAttributeId: String!
    ) {
      taskTemplateModuleAttribute_update(
        id: $id
        data: {
          taskTemplate: { id: $taskTemplateId },
          moduleAttribute: { id: $moduleAttributeId }
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
export const deleteTaskTemplateModuleAttribute = async (id: string) => {
  const query = `
    mutation DeleteTaskTemplateModuleAttribute($id: String!) {
      taskTemplateModuleAttribute_delete(id: $id)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};
