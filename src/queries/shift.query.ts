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
  weekdayOrdinals: Int[];
}

export interface ShiftWorkerInput {
  id: string;
  shiftId: string;
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
    mutation CreateShift($id: String!, $name: String!, $startTime: Timestamp!, $endTime: Timestamp!, $lunchStartTime: Timestamp!, $lunchEndTime: Timestamp!, $weekdayOrdinals: [Int!]!) {
      shift_insert(data: { id: $id, name: $name, startTime: $startTime, endTime: $endTime, lunchStartTime: $lunchStartTime, lunchEndTime: $lunchEndTime, weekdayOrdinals: $weekdayOrdinals })
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

export const updateWorkerShiftId = async (
  input: ShiftWorkerInput & { id: string; shiftId: string }
) => {
  const query = `
    mutation UpdateWorkerShiftId($id: String!, $shiftId: String!) {
      worker_update(id: $id, data: { shiftId: $shiftId })
    }
  `;
  const response = await dataConnect.executeGraphql<
    { worker_update: { id: string; shiftId: string } },
    { id: string; shiftId: string }
  >(query, {
    variables: { id: input.id, shiftId: input.shiftId },
  });

  return response.data;
};

export const getAllUnavailableWorkers = async () => {
  const query = `
    query GetAllWorkers {
      workers (where: { shiftId: { isNull: false } } ) {
        id
        firstName
        lastName
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { workers: { id: string; firstName: string; lastName: string }[] },
    {}
  >(query);

  return response.data?.workers ?? [];
};

export const getAllAvailableWorkers = async () => {
  const query = `
    query GetAllAvailableWorkers {
      workers(where: { shiftId: { isNull: true } }) {
        id
        firstName
        lastName
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { workers: { id: string; firstName: string; lastName: string }[] },
    {}
  >(query);

  return response.data?.workers ?? [];
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
        weekdayOrdinals
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
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { shifts: ShiftInput[] },
    {}
  >(query);

  return response.data?.shifts ?? [];
};

export const getAllShiftsWithWorkersCount = async () => {
  // 1. Get all shifts
  const shifts = await getAllShifts();

  // 2. Prepare GraphQL query for worker count
  const query = `
    query GetWorkersCount($id: String!) {
      workers(
        where: {
          shift: { id: { eq: $id } }
        }
      ) {
        _count
      }
    }
  `;

  const results = [];

  // 3. Loop through each shift and fetch workers count
  for (const shift of shifts) {
    const response = await dataConnect.executeGraphql<
      { workers: { _count: number }[] },
      { id: string }
    >(query, {
      variables: { id: shift.id },
    });

    const workersCount = response.data?.workers[0]?._count ?? 0;

    // 4. Merge count into shift object
    results.push({
      id: shift.id,
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      lunchStartTime: shift.lunchStartTime,
      workersCount,
    });
  }

  return results;
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

type Shift = {
  id: string;
  name: string;
  weekdayOrdinals: number[] | null;
};

const formatShiftWeek = (shift: Shift) => {
  const result = Array(7).fill(" ");
  const days = shift.weekdayOrdinals ?? [];

  for (const day of days) {
    if (day >= 1 && day <= 7) {
      result[day - 1] = shift.name;
    }
  }

  return result;
};

export const getAllAssignedShiftsTotheWeekDays = async () => {
  const query = `
    query GetAllShifts {
      shifts {
        id
        name
        weekdayOrdinals
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { shifts: { id: string; name: string; weekdayOrdinals: number[] }[] },
    {}
  >(query, {});

  const shifts = response.data?.shifts ?? [];

  // Map each shift to include the formatted array
  return shifts.map((shift) => ({
    ...shift,
    weekArray: formatShiftWeek(shift),
  }));
};

export const deleteShiftWeek = async (
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

export const updateShift = async (
  id: string,
  input: Partial<ShiftUpdateInput>
) => {
  const query = `
    mutation UpdateShift(
      $id: String!, 
      $name: String, 
      $startTime: Timestamp!, 
      $endTime: Timestamp!, 
      $lunchStartTime: Timestamp!, 
      $lunchEndTime: Timestamp!, 
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
