import { dataConnect } from "../config/dataConnectClient";

type Int = number & { __int__: void };

function toInt(n: number): Int {
  if (!Number.isInteger(n)) {
    throw new Error("Value is not an integer");
  }
  return n as Int;
}

export interface ShiftInput {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  lunchStartTime: number;
  lunchEndTime: number;
}

export interface ShiftUpdateInput {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  lunchStartTime: number;
  lunchEndTime: number;
  weekOrdinals?: Int[];
}

export interface ShiftWeekInput {
  weekdayOrdinals: number[];
}

// Create
export const createShift = async (input: ShiftInput & { id: string }) => {
  const query = `
    mutation CreateShift($id: String!, $name: String!, $startTime: Float!, $endTime: Float!, $lunchStartTime: Float!, $lunchEndTime: Float!) {
      shift_insert(data: { id: $id, name: $name, startTime: $startTime, endTime: $endTime, lunchStartTime: $lunchStartTime, lunchEndTime: $lunchEndTime })
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

export const updateShiftWeek = async (
  input: ShiftWeekInput & { id: string }
) => {
  const query = `
    mutation UpdateShiftWeek($id: String!, $weekdayOrdinals: [Int!]!) {
      shift_update(
        id: $id
        data: { weekdayOrdinals: $weekdayOrdinals }
      )
    }
  `;

  const response = await dataConnect.executeGraphql<
    { shift_update: ShiftWeekInput },
    ShiftWeekInput & { id: string }
  >(query, {
    variables: {
      id: input.id,
      weekdayOrdinals: input.weekdayOrdinals,
    },
  });

  return response.data;
};

export const getAllShiftsName = async () => {
  const query = `
    query GetAllShiftsName {
      shifts {
        id
        name
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { shifts: { id: string; name: string }[] },
    {}
  >(query);

  return response.data?.shifts ?? [];
};

// Read all
export const getAllShifts = async () => {
  const query = `
    query GetAllShifts {
      shifts {
        id
        name
        startTime
        endTime
        lunchStartTime
        lunchEndTime
        weekdayOrdinals
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { shifts: ShiftInput[] },
    {}
  >(query);

  return response.data?.shifts ?? [];
};

// Read one
export const getShiftById = async (id: string) => {
  const query = `
    query GetShiftById($id: String!) {
      shift(id: $id) {
        id
        name
        startTime
        endTime
        lunchStartTime
        lunchEndTime
        weekdayOrdinals
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { shift: ShiftInput | null },
    { id: string }
  >(query, {
    variables: { id },
  });

  return response.data?.shift ?? null;
};

export const updateShift = async (id: string, input: Partial<ShiftUpdateInput>) => {
  const query = `
    mutation UpdateShift(
      $id: String!, 
      $name: String, 
      $startTime: Float, 
      $endTime: Float, 
      $lunchStartTime: Float, 
      $lunchEndTime: Float, 
      $weekdayOrdinals: [Int!]
    ) {
      shift_update(
        id: $id,
        data: {
          name: $name,
          startTime: $startTime,
          endTime: $endTime,
          lunchStartTime: $lunchStartTime,
          lunchEndTime: $lunchEndTime,
          weekdayOrdinals: $weekdayOrdinals
        }
      )
    }
  `;

  const response = await dataConnect.executeGraphql<
    { shift_update: ShiftUpdateInput },
    {
      id: string;
      name?: string;
      startTime?: number;
      endTime?: number;
      lunchStartTime?: number;
      lunchEndTime?: number;
      weekdayOrdinals?: number[];
    }
  >(query, {
    variables: {
      id,
      ...input,
    },
  });

  return response.data?.shift_update ?? [];
};


// Delete
export const deleteShift = async (id: string) => {
  const query = `
    mutation DeleteShift($id: String!) {
      shift_delete(id: $id)
    }
  `;

  await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return true;
};
