import { dataConnect } from "../config/dataConnectClient";

export interface ProjectInput {
  name: string;
}

// Create
export const createProject = async (input: ProjectInput & { id: string }) => {
  const query = `
    mutation CreateProject($id: String!, $name: String!) {
      project_insert(data: { id: $id, name: $name })
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

// Read all
export const getAllProjects = async () => {
  const query = `
    query GetProjects {
      projects {
        id
        name
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Read one
export const getProjectById = async (id: string) => {
  const query = `
    query GetProject($id: String!) {
      project(id: $id) {
        id
        name
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });

  return response.data;
};

// Update
export const updateProject = async (id: string, input: Partial<ProjectInput>) => {
  const query = `
    mutation UpdateProject($id: String!, $name: String!) {
      project_update(id: $id, data: { name: $name })
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id, ...input },
  });

  return response.data;
};

// Delete
export const deleteProject = async (id: string) => {
  const query = `
    mutation DeleteProject($id: String!) {
      project_delete(id: $id)
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });

  return response.data;
};
