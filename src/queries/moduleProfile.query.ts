export const CREATE_MODULEPROFILE = `
  mutation CreateModuleProfile($id: String!, $name: String!) {
    moduleProfile_insert(
      data: {id: $id, name: $name}
    )
  }
`;


export const GET_MODULEPROFILES = `
  query GetModuleProfiles {
    moduleProfiles{
      id
      name
    }
  }
`;

export const GET_MODULEPROFILE_BY_ID = `
  query GetModuleProfileById($id: ID!) {
    moduleProfile(id: $id) {
      id
      name
      project{
      id
      name
      }
    }
  }
`;