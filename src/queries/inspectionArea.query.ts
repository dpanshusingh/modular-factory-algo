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
  order: number;
}

// Create
export const createInspectionArea = async (input: InspectionAreaInput) => {
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
      inspectionAreas (orderBy: [{ order: ASC }]) {
        id
        name
        order
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

export const inspectionAreaCount = async (): Promise<number> => {
  const query = `
   query CountinspectionArea{
      inspectionAreas {
        _count
      }
}
  `;

  const response = await dataConnect.executeGraphql(query, {});
  const count = (response.data as any)?.inspectionAreas?.[0]?._count ?? 0;
  return count;
};


// Read one
export const getInspectionAreaById = async (id: string) => {
  const query = `
    query GetInspectionAreaById($id: String!) {
      inspectionArea(id: $id){
        id
        name
        order
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};


export const UpdateInspectionAreaOrder = async (
  id: string,
  input: Partial<InspectionAreaInput>
) => {
  const query = `
    mutation UpdateinspectionArea($id: String!, $data: inspectionArea_update_input!) {
      inspectionArea_update(id: $id, data: $data)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id, data: input },
  });
  return response.data ?? null;
};

export const getStationsFromInspectionAreas = async (id: string) => {
  const query = `
    query GetStations($id: String!) {
      stations(
        where: {
          inspectionArea: { id: { eq: $id } }
        }
        orderBy: { order: ASC }
      ) {
        id
        order
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });

  return (response.data as any)?.stations ?? [];
};

// Update
export const updateInspectionArea = async (
  id: string,
  input: Partial<InspectionAreaInput>
) => {
  const query = `
    mutation UpdateInspectionArea($id: String!, $name: String!) {
      inspectionArea_update(id: $id, data: { name: $name})
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
