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



