import { dataConnect } from "../config/dataConnectClient";

interface TravelTemplateTaskTemplateInput {
  travelerTemplateId: string;
  taskTemplateId: string;
}

// Create
export const createTravelerTemplateTaskTemplate = async (
  input: TravelTemplateTaskTemplateInput & { id: string }
) => {
  const query = `
    mutation CreateTravelerTemplateTaskTemplate($id: String! ,$travelerTemplateId: String!, $taskTemplateId: String!) {
      travelerTemplateTaskTemplate_insert(
        data: { id: $id,travelerTemplateId: $travelerTemplateId, taskTemplateId: $taskTemplateId }
      )
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

// Read all
export const getAllTravelerTemplateTaskTemplates = async () => {
  const query = `
    query {
      travelerTemplateTaskTemplates {
        id
        taskTemplate{
          id name station { id order name }
        }
        travelerTemplate{ id name }
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Read one
export const getTravelerTemplateTaskTemplateById = async (id: string) => {
  const query = `
    query GetTravelerTemplateTaskTemplate($id: String!) {
      travelerTemplateTaskTemplate(id: $id) {
         id
        taskTemplate{
          id name station { id order name }
        }
        travelerTemplate{ id name }
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};

// Read one by travelerId
export const getTravelerTemplateTaskTemplatesByTravelerId = async (
  id: string
) => {
  const query = `
    query GetTravelerTemplateTaskTemplates($id: String!) {
      travelerTemplateTaskTemplates(
        where: { travelerTemplate: { id: { eq: $id } } }
      ) {
        id
        taskTemplate {
          id
          name
          station {
            id
            order
            name
          }
        }
        travelerTemplate {
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
export const updateTravelerTemplateTaskTemplate = async (
  id: string,
  input: Partial<TravelTemplateTaskTemplateInput>
) => {
  const query = `
  mutation UpdateTravelerTemplateTaskTemplate($id: String! ,$travelerTemplateId: String!, $taskTemplateId: String!) {
     travelerTemplateTaskTemplate_update(
    id: $id
    data: {travelerTemplateId: $travelerTemplateId, taskTemplateId: $taskTemplateId }
  )
  }
`;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id, ...input },
  });

  return response.data;
};

// Delete
export const deleteTravelerTemplateTaskTemplate = async (id: string) => {
  const query = `
    mutation DeleteTravelerTemplateTaskTemplate($id: String!) {
      travelerTemplateTaskTemplate_delete(id: $id)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};
