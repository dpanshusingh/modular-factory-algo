import { dataConnect } from "../config/dataConnectClient";

export interface DepartmentInput {
  name: string;
}

// Create
export const createDepartment = async (
  input: DepartmentInput & { id: string }
) => {
  const query = `
    mutation CreateDepartment($id: String!, $name: String!) {
      department_insert(data: { id: $id, name: $name })
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

// Read all
export const getAllDepartments = async () => {
  const query = `
    query GetDepartment {
      departments {
        id
        name
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Read one
export const getDepartmentById = async (id: string) => {
  const query = `
    query GetDepartmentById($id: String!) {
      department(id: $id) {
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
export const updateDepartment = async (
  id: string,
  input: Partial<DepartmentInput>
) => {
  const query = `
    mutation UpdateDepartment($id: String!, $name: String!) {
      department_update(id: $id, data: { name: $name })
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id, ...input },
  });

  return response.data;
};

// Delete
export const deleteDepartment = async (id: string) => {
  const query = `
    mutation DeleteDepartment($id: String!) {
      department_delete(id: $id)
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });

  return response.data;
};
