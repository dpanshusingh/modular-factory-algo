// queries/project.query.ts
export const CREATE_PROJECT = `
  mutation CreateProject($id: String! ,$name: String!) {
    project_insert(data: {id: $id ,name: $name })
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
  mutation UpdateProject($id: String!, $name: String!) {
    project_update(id: $id, data: { name: $name })
  }
`;

// ✅ DELETE
export const DELETE_PROJECT = `
  mutation DeleteProject($id: String!) {
    project_delete(id: $id)
  }
`;

