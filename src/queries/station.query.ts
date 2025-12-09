import { dataConnect } from "../config/dataConnectClient";

type Int = number & { __int__: void };

function toInt(n: number): Int {
  if (!Number.isInteger(n)) {
    throw new Error("Value is not an integer");
  }
  return n as Int;
}

export interface StationInput {
  id: string;
  doesReceiveTravelers: Boolean;
  canReceiveMultipleTravelers: Boolean;
  name: string;
  order: number;
  inspectionAreaId: string;
}

// Create
export const createStation = async (input: StationInput & { id: string }) => {
  const query = `
    mutation CreateStation($id: String!, $name: String!, $doesReceiveTravelers: Boolean!,$canReceiveMultipleTravelers:Boolean!, $order: Int!, $inspectionAreaId: String!) {
      station_insert(
      data: { 
      id: $id, 
      name: $name, 
      doesReceiveTravelers: $doesReceiveTravelers, 
      canReceiveMultipleTravelers:$canReceiveMultipleTravelers
      order: $order,
      inspectionArea: {id: $inspectionAreaId }
      })
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

interface Station {
  id: string;
  order: number;
}

interface ExecuteGraphqlResponse {
  stations: Station[];
}

// Read all
export const getAllStations = async () => {
  const query = `
    query {
      stations (orderBy: [{ order: ASC }]) {
        id
        doesReceiveTravelers
        canReceiveMultipleTravelers
        order
        name
        inspectionArea { id name order}
      }
    }
  `;
  const response = await dataConnect.executeGraphql<ExecuteGraphqlResponse, {}>(
    query,
    {}
  );
  return response?.data?.stations ?? [];
};

export const stationsCounts = async (): Promise<number> => {
  const query = `
   query Countstations{
      stations {
        _count
      }
}
  `;

  const response = await dataConnect.executeGraphql(query, {});
  const count = (response.data as any)?.stations?.[0]?._count ?? 0;

  return count;
};

export const UpdateStationOrder = async (id: string, order: number) => {
  const query = `
  mutation UpdateStation($id: String!, $order: Int!) {
    station_update(
      key: { id: $id }
      data: { order: $order }
    )
  }
`;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id, order },
  });
  return response.data ?? null;
};

// Read one
export const getStationById = async (id: string) => {
  const query = `
    query GetStationById($id: String!) {
      station(id: $id){
        id
        doesReceiveTravelers
        canReceiveMultipleTravelers
        order
        name
        inspectionArea { id name order}
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};

// Update Station area
export const updateStation = async (
  id: string,
  input: Partial<StationInput>
) => {
  const query = `
mutation UpdateStation($id: String!, $name: String!, $doesReceiveTravelers: Boolean!, $canReceiveMultipleTravelers:Boolean!, $inspectionAreaId: String!) {
    station_update(
        id: $id
        data: {
            doesReceiveTravelers: $doesReceiveTravelers
            canReceiveMultipleTravelers:$canReceiveMultipleTravelers
            name: $name
            inspectionArea: { id: $inspectionAreaId }
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
export const deleteStation = async (id: string) => {
  const query = `
    mutation DeleteStation($id: String!) {
        station_delete(id: $id)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};
