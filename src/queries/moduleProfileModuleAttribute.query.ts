import { dataConnect } from "../config/dataConnectClient";

interface moduleProfileModuleAttributeInput {
  moduleProfileId: string;
  moduleAttributeId: string;
  value: string;
}

// Create
export const createModuleProfileModuleAttribute = async (
  input: moduleProfileModuleAttributeInput & { id: string }
) => {
  const query = `
    mutation CreateModuleProfileModuleAttribute(
      $id: String!,
      $moduleProfileId: String!,
      $moduleAttributeId: String!,
      $value: String!
    ) {
      moduleProfileModuleAttribute_insert(
        data: { 
          id: $id, 
          moduleProfileId: $moduleProfileId,
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

export const getDataWithModuleProfile = async (moduleProfileId: string) => {
  const query = `
    query CountModuleProfiles($moduleProfileId: String!) {
      moduleProfileModuleAttributes(
        where: { moduleProfile: { id: { eq: $moduleProfileId } } }
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
    { moduleProfileModuleAttributes: { id: string }[] },
    { moduleProfileId: string }
  >(query, {
    variables: { moduleProfileId: moduleProfileId },
  });

  return response.data?.moduleProfileModuleAttributes ?? [];
};

// Read all
export const getAllModuleProfileModuleAttributes = async () => {
  const query = `
    query {
      moduleProfileModuleAttributes {
        id
        moduleProfile{
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
export const getModuleProfileModuleAttributeById = async (id: string) => {
  const query = `
    query {
      moduleProfileModuleAttribute(id: "${id}") {
        id
        moduleProfile{
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
export const updateModuleProfileModuleAttribute = async (
  id: string,
  input: Partial<moduleProfileModuleAttributeInput>
) => {
  const query = `
    mutation UpdateModuleProfileModuleAttribute(
      $id: String!,
      $moduleProfileId: String,
      $moduleAttributeId: String,
      $value: String
    ) {
      moduleProfileModuleAttribute_update(
        id: $id
        data: { 
          moduleProfileId: $moduleProfileId,
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
export const deleteModuleProfileModuleAttribute = async (id: string) => {
  const query = `
    mutation DeleteModuleProfileModuleAttribute($id: String!) {
      moduleProfileModuleAttribute_delete(id: $id)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};
