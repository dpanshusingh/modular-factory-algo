import { dataConnect } from "../config/dataConnectClient";

interface TravelTemplateInspectionItemTemplateInput {
  inspectionItemTemplateId: string;
  taskTemplateId: string;
}

// Create
export const createTravelerTemplateInspectionItemTemplate = async (
  input: TravelTemplateInspectionItemTemplateInput & { id: string }
) => {
  const query = `
    mutation CreateTravelerTemplateInspectionItemTemplate(
    $id: String! ,
    $travelerTemplateId: String!, 
    $inspectionItemTemplateId: String!
    ) {
      travelerTemplateInspectionItemTemplate_insert(
        data: { 
            id: $id,
            travelerTemplateId: $travelerTemplateId, 
            inspectionItemTemplateId: $inspectionItemTemplateId 
        }
      )
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

// Read all
export const getAllTravelerTemplateInspectionItemTemplates = async () => {
  const query = `
    query {
      travelerTemplateInspectionItemTemplates {
        id
        inspectionItemTemplate{
          id name inspectionArea { id order name }
        }
        travelerTemplate{ id name }
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Read one
export const getTravelerTemplateInspectionItemTemplateById = async (
  id: string
) => {
  const query = `
    query GetTravelerTemplateInspectionItemTemplate($id: String!) {
      travelerTemplateInspectionItemTemplate(id: $id) {
         id
        inspectionItemTemplate{
          id name inspectionArea { id order name }
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

// Update
export const updateTravelerTemplateInspectionItemTemplate = async (
  id: string,
  input: Partial<TravelTemplateInspectionItemTemplateInput>
) => {
  const query = `
  mutation UpdateTravelerTemplateInspectionItemTemplate(
  $id: String! ,
  $travelerTemplateId: String!, 
  $inspectionItemTemplateId: String!
  ) {
     travelerTemplateInspectionItemTemplate_update(
    id: $id
    data: {
        travelerTemplateId: $travelerTemplateId, 
        inspectionItemTemplateId: $inspectionItemTemplateId 
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
export const deleteTravelerTemplateInspectionItemTemplate = async (
  id: string
) => {
  const query = `
    mutation DeleteTravelerTemplateInspectionItemTemplate($id: String!) {
      travelerTemplateInspectionItemTemplate_delete(id: $id)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};
