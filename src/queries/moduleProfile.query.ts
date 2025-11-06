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