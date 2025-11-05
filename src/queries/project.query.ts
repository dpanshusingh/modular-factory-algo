// queries/project.query.ts
export const CREATE_PROJECT = `
  mutation CreateProject($name: String!) {
    project_insert(data: { name: $name })
  }
`;


export const GET_PROJECTS = `
  query GetProjects {
    projects{
      id
      name
    }
  }
`;

export const UPDATE_PROJECT = `
  mutation UpdateProject($id: UUID!, $name: String!) {
    project_update(id: $id, data: { name: $name })
  }
`;

// ✅ DELETE
export const DELETE_PROJECT = `
  mutation DeleteProject($id: UUID!) {
    project_delete(id: $id)
  }
`;

