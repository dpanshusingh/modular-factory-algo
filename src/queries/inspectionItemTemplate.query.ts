import { dataConnect } from "../config/dataConnectClient";

type Int = number & { __int__: void };

function toInt(n: number): Int {
  if (!Number.isInteger(n)) {
    throw new Error("Value is not an integer");
  }
  return n as Int;
}

export type LeadType =
  | "closeup"
  | "drywall"
  | "electrical"
  | "exterior"
  | "floors"
  | "hvac"
  | "insulation"
  | "interior"
  | "office"
  | "paint"
  | "plumbing"
  | "roofing"
  | "shipping"
  | "walls";

export interface InspectionItemTemplateInput {
  id: string;
  isPhotoRequired: boolean;
  isVideoRequired: boolean;
  leadType: LeadType;
  name: string;
  order: Int;
  inspectionAreaId: string;
}

// Read all
export const getAllInspectionItemTemplates = async () => {
  const query = `
    query {
      inspectionItemTemplates {
        id
        isPhotoRequired
        isVideoRequired
        leadType
        name
        order
        inspectionArea { 
          id
          name
          order
        }
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Read one
export const getInspectionItemTemplateById = async (id: string) => {
  const query = `
    query GetInspectionItemTemplateById($id: String!) {
      inspectionItemTemplate(id: $id){
        id
        isPhotoRequired
        isVideoRequired
        leadType
        name
        order
        inspectionArea { 
          id
          name
          order
        }
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};
