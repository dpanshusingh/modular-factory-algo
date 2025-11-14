import { dataConnect } from "../config/dataConnectClient";

type Int = number & { __int__: void };

function toInt(n: number): Int {
  if (!Number.isInteger(n)) {
    throw new Error("Value is not an integer");
  }
  return n as Int;
}

export interface InspectionAreaInput {
    id: string;
    name: string;
    order: Int;
}

// Create
export const createInspectionArea = async (input: InspectionAreaInput & { id: string , name: string, order: Int}) => {
  const query = `
    mutation CreateInspectionArea($id: String!, $name: String!, $order: Int!) {
      inspectionArea_insert(data: { id: $id, name: $name, order: $order })
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

// Read all
export const getAllInspectionArea = async () => {
  const query = `
    query GetInspectionArea {
      inspectionAreas {
        id
        name
        order
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

// Update
export const updateInspectionArea = async (id: string, input: Partial<InspectionAreaInput>) => {
  const query = `
    mutation UpdateInspectionArea($id: String!, $name: String!, $order: Int!) {
      inspectionArea_update(id: $id, data: { name: $name, order: $order })
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id, ...input },
  });

  return response.data;
};

// Delete
export const deleteInspectionArea = async (id: string) => {
  const query = `
    mutation DeleteInspectionArea($id: String!) {
      inspectionArea_delete(id: $id)
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });

  return response.data;
};