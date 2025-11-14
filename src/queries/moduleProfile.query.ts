import { dataConnect } from "../config/dataConnectClient";

interface ModuleProfileInput {
  // id: string;
  name: string;
  projectId: string;
}

// Create
export const createModuleProfile = async (input: ModuleProfileInput & { id: string }) => {
  const query = `
    mutation CreateModuleProfile($id: String! ,$name: String!, $projectId: String!) {
      moduleProfile_insert(
        data: { id: $id,name: $name, project: { id: $projectId } }
      )
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

// Read all
export const getAllModuleProfiles = async () => {
  const query = `
    query {
      moduleProfiles {
        id
        name
        project { id name }
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Read one
export const getModuleProfileById = async (id: string) => {
  const query = `
    query GetModuleProfile($id: String!) {
      moduleProfile(id: $id) {
        id
        name
        project {
          id
          name
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
export const updateModuleProfile = async (
  id: string,
  input: Partial<ModuleProfileInput>
) => {
  const query = `
  mutation UpdateModuleProfile($id: String!, $name: String!, $projectId: String!) {
     moduleProfile_update(
    id: $id
    data: {
      name: $name
      project: { id: $projectId }
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
export const deleteModuleProfile = async (id: string) => {
  const query = `
    mutation DeleteModuleProfile($id: String!) {
      moduleProfile_delete(id: $id)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};
