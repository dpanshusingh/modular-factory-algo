import { dataConnect } from "../config/dataConnectClient";

interface timeStudyModuleAttributeInput {
  timeStudyId: string;
  moduleAttributeId: string;
  value: string;
}

// Create
export const createTimeStudyModuleAttribute = async (
  input: timeStudyModuleAttributeInput & { id: string }
) => {
  const query = `
    mutation CreateTimeStudyModuleAttribute(
      $id: String!,
      $timeStudyId: String!,
      $moduleAttributeId: String!,
      $value: String!
    ) {
      timeStudyModuleAttribute_insert(
        data: { 
          id: $id, 
          timeStudyId: $timeStudyId,
          moduleAttributeId: $moduleAttributeId,
          value: $value
        }
      )
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

export const getDataWithTimeStudy = async (timeStudyId: string) => {
  const query = `
    query CountTimeStudies($timeStudyId: String!) {
      timeStudyModuleAttributes(
        where: { timeStudy: { id: { eq: $timeStudyId } } }
      ) {
        id
        moduleAttribute{
          id
          name
          moduleAttributeType
        }
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { timeStudyModuleAttributes: { id: string }[] },
    { timeStudyId: string }
  >(query, {
    variables: { timeStudyId },
  });

  return response.data?.timeStudyModuleAttributes ?? [];
};

// Read all
export const getAllTimeStudyModuleAttributes = async () => {
  const query = `
    query {
      timeStudyModuleAttributes {
        id
        timeStudy{
          id
        }
        moduleAttribute{
          id
          name
          moduleAttributeType
        }
        value
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Read one
export const getTimeStudyModuleAttributeById = async (id: string) => {
  const query = `
    query {
      timeStudyModuleAttribute(id: "${id}") {
        id
        timeStudy{
          id
        }
        moduleAttribute{
          id
          name
          moduleAttributeType
        }
        value
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? null;
};

// Update
export const updateTimeStudyModuleAttribute = async (
  id: string,
  input: Partial<timeStudyModuleAttributeInput>
) => {
  const query = `
    mutation UpdateTimeStudyModuleAttribute(
      $id: String!,
      $timeStudyId: String,
      $moduleAttributeId: String,
      $value: String
    ) {
      timeStudyModuleAttribute_update(
        id: $id
        data: { 
          timeStudyId: $timeStudyId,
          moduleAttributeId: $moduleAttributeId,
          value: $value
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
export const deleteTimeStudyModuleAttribute = async (id: string) => {
  const query = `
    mutation DeleteTimeStudyModuleAttribute($id: String!) {
      timeStudyModuleAttribute_delete(id: $id)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};

export const deleteDataWithTimeStudy = async (timeStudyId: string) => {
  const query = `
    mutation DeleteTimeStudies($timeStudyId: String!) {
      timeStudyModuleAttribute_deleteMany(
        where: { timeStudyId: { eq: $timeStudyId } }
      ) 
    }
  `;

  const response = await dataConnect.executeGraphql<
    { timeStudyModuleAttribute_deleteMany: number },
    { timeStudyId: string }
  >(query, {
    variables: { timeStudyId },
  });
  // Return number of deleted rows
  return response.data?.timeStudyModuleAttribute_deleteMany ?? 0;
};
