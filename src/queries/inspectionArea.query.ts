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

interface InspectionArea {
  id: string;
  name: string;
  order: number;
}

interface Station {
  order: number;
  inspectionArea?: {
    id: string;
  } | null;
}

// Outer response wrapper from dataConnect.executeGraphql
interface ExecuteGraphqlResponse {
  inspectionAreas: InspectionArea[];
  stations: Station[];
  errors?: any;
}

interface InspectionAreaStationOrders {
  id: string;
  inspectionOrder: number;
  inspectionName: string;
  stationOrders: number[];
}

export const getAllInspectionAreas = async (): Promise<InspectionArea[]> => {
  const query = `
    query GetInspectionArea {
      inspectionAreas(orderBy: [{ order: ASC }]) {
        id
        name
        order
      }
    }
  `;

  const response = await dataConnect.executeGraphql<ExecuteGraphqlResponse, {}>(
    query,
    {}
  );

  // ✅ Correct field: inspectionAreas (plural) inside data
  return response.data?.inspectionAreas ?? [];
};

export const getInspectionAreaStationOrders = async (): Promise<
  InspectionAreaStationOrders[]
> => {
  const inspectionAreas = await getAllInspectionAreas();

  const query = `
    query GetAllStations {
      stations(orderBy: { order: ASC }) {
        order
        inspectionArea { id }
      }
    }
  `;

  const response = await dataConnect.executeGraphql<ExecuteGraphqlResponse, {}>(
    query,
    {}
  );
  const allStations: Station[] = response.data?.stations ?? [];

  const stationOrdersByArea: Record<string, number[]> = {};

  // Group station orders by inspection area ID
  allStations.forEach((station) => {
    const areaId = station.inspectionArea?.id;
    if (!areaId) return;

    if (!stationOrdersByArea[areaId]) {
      stationOrdersByArea[areaId] = [];
    }

    stationOrdersByArea[areaId].push(station.order);
  });

  // ALWAYS include all inspection areas
  return inspectionAreas.map((area) => ({
    id: area.id,
    inspectionOrder: area.order,
    inspectionName: area.name,
    stationOrders: stationOrdersByArea[area.id] ?? [],
  }));
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
