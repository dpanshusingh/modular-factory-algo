import { dataConnect } from "../config/dataConnectClient";

// Create
export const createPtoRequest = async (input: any) => {
  const query = `
    mutation CreatePtoRequest(
      $id: String!,
      $workerId: String!,
      $startDate: Timestamp,
      $endDate: Timestamp,
      $type: PtoType,
      $hoursRequested: Float,
      $note: String,
      $status: PtoRequestStatus
    ) {
      ptoRequest_insert(
        data: {
          id: $id,
          worker: { id: $workerId },
          startDate: $startDate,
          endDate: $endDate,
          type: $type,
          hoursRequested: $hoursRequested,
          note: $note,
          status: $status
        }
      )
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

export const getPtoRequests = async (params: {
  limit: number;
  offset: number;
}) => {
  const query = `
    query GetPtoRequests($limit: Int!, $offset: Int!) {
      ptoRequests(
        limit: $limit,
        offset: $offset
      ) {
        id
        startDate
        endDate
        status
        type
        hoursRequested
        note
        worker {
          id 
          firstName
          lastName
        }
      }
    }
  `;
  try {
    const response = await dataConnect.executeGraphql(query, {
      variables: {
        limit: params.limit,
        offset: params.offset,
      },
    });
    return response.data;
  } catch (error) {
    console.error("PTO Request query failed:", error);
    throw error;
  }
};

export const updatePtoRequest = async (data: any) => {
  const updateFields: string[] = [];
  if (data.startDate) updateFields.push(`startDate: "${data.startDate}"`);
  if (data.endDate) updateFields.push(`endDate: "${data.endDate}"`);
  if (data.status) updateFields.push(`status: "${data.status}"`);
  if (data.type) updateFields.push(`type: "${data.type}"`);
  if (data.hoursRequested)
    updateFields.push(`hoursRequested: ${Number(data.hoursRequested)}`);
  if (data.note) updateFields.push(`note: "${data.note}"`);
  const dataPayloadString = updateFields.join(", ");

  const query = `
    mutation UpdatePtoRequest(
      $id: String!             
    ) {
      ptoRequest_update(
        id: $id,           
        data: {           
          ${dataPayloadString}
        } 
      )
    }
  `;
  const variables: Record<string, any> = { id: String(data.id) };
  try {
    const response = await dataConnect.executeGraphql(query, { variables });
    return response.data;
  } catch (error) {
    console.error("PTO Request update failed:", error);
    throw error;
  }
};

export const getPtoCount = async (): Promise<number> => {
  const query = `
    query GetPtoRequestCount {
      ptoRequests_count
    }
  `;
  try {
    const response: any = await dataConnect.executeGraphql(query, {
      variables: {},
    });
    const totalCount = response.data?.ptoRequests_count ?? 0;
    return totalCount;
  } catch (error) {
    console.error("PTO Request count query failed:", error);
    throw error;
  }
};
