import { dataConnect } from "../config/dataConnectClient";

export interface TravelerTemplateInput {
  name: string;
}

// Create
export const createTravelerTemplate = async (input: TravelerTemplateInput & { id: string }) => {
  const query = `
    mutation CreateTravelerTemplate($id: String!, $name: String!) {
      travelerTemplate_insert(data: { id: $id, name: $name })
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

// Read all
export const getAllTravelerTemplates = async () => {
  const query = `
    query GetTravelerTemplates {
      travelerTemplates {
        id
        name
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Read one
export const getTravelerTemplateById = async (id: string) => {
  const query = `
    query GetTravelerTemplate($id: String!) {
      travelerTemplate(id: $id) {
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
export const updateTravelerTemplate = async (id: string, input: Partial<TravelerTemplateInput>) => {
  const query = `
    mutation UpdateTravelerTemplate($id: String!, $name: String!) {
      travelerTemplate_update(id: $id, data: { name: $name })
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id, ...input },
  });

  return response.data;
};

// Delete
export const deleteTravelerTemplate = async (id: string) => {
  const query = `
    mutation DeleteTravelerTemplate($id: String!) {
      travelerTemplate_delete(id: $id)
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });

  return response.data;
};
