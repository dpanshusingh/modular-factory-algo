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

// Read all
export const getAllStations = async () => {
  const query = `
    query {
      stations {
        id
        doesReceiveTravelers
        canReceiveMultipleTravelers
        order
        name
        inspectionArea { id name order}
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};
export const stationsCounts = async (): Promise<Int> => {
  const query = `
    query {
      stations {
        id
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {});
  const stations = (response.data as any)?.stations ?? [];
  return stations.length;
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
