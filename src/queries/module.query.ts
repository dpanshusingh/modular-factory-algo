import { dataConnect } from "../config/dataConnectClient";

type Int = number & { __int__: void };

function toInt(n: number): Int {
  if (!Number.isInteger(n)) {
    throw new Error("Value is not an integer");
  }
  return n as Int;
}

export interface moduleInput {
  id: string;
  moduleProfileId: string;
  travelerId: string;
  travelerTemplateId: string;
  order: Int;
  serialNumber: string;
}

// Create
export const createModule = async (input: moduleInput) => {
  const query = `
  mutation CreateModule(
    $id: String!,
    $moduleProfileId: String!,
    $travelerId: String,
    $travelerTemplateId: String!,
    $order: Int,
    $serialNumber: String
  ) {
    module_insert(
      data: {
        id: $id,
        moduleProfileId: $moduleProfileId,
        travelerId: $travelerId,
        travelerTemplateId: $travelerTemplateId,
        order: $order,
        serialNumber: $serialNumber
      }
    )
  }
`;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};
//GetAll

export const getAllModule = async () => {
  const query = `
    query {
      modules(orderBy: {order: ASC}) {
        id
        moduleProfile{id name project{id name} }
        travelerId
        travelerTemplate{id name}
        order
        serialNumber
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {});

  // Read correct field "modules"
  const modules = (response.data as any)?.modules ?? [];

  // Filter where travelerId is NULL
  return modules.filter((item: any) => item.travelerId === null);
};

export const getAllModuleCount = async () => {
  const query = `
    query CountModules{
      modules {
        _count
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  const count = (response.data as any)?.modules?.[0]?._count ?? 0;
  return count;
 
  
}




//GetById
export const GetByIdModule = async (id: string) => {
  const query = `
    query GetModuleById($id: String!) {
      module(id: $id) {
        id
        moduleProfileId
        travelerId
        travelerTemplateId
        order
        serialNumber
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });

  return (response.data as any)?.module ?? null;
};

//Update

export const UpdateModule = async (id: string, input: Partial<moduleInput>) => {
  const query = `
    mutation UpdateModule($id:String , $serialNumber: String ,$moduleProfileId: String, $travelerId: String,$travelerTemplateId: String,$order:Int) {
      module_update(id: $id, data: {serialNumber: $serialNumber,moduleProfileId: $moduleProfileId, travelerId: $travelerId,travelerTemplateId: $travelerTemplateId,order: $order })
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id, ...input },
  });

  return (response.data as any)?.module?.[0] ?? null;
};

export const UpdateModuleOrder = async (
  id: string,
  input: Partial<moduleInput>
) => {
  const query = `
    mutation UpdateModule($id: String!, $data: module_update_input!) {
      module_update(id: $id, data: $data)
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id, data: input },
  });

  return response.data ?? null;
};


// Delete Module (Only if travelerId is NULL)
export const DeleteModule = async (id: string) => {
  // Step 1: Fetch record first
  const query = `
    query DeleteModule($id: String!) {
      module(id: $id) {
        id
        travelerId
    
      }
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });

  const record = (response.data as any)?.module ?? null;

  // Step 2: If record does not exist
  if (!record) {
    throw new Error("Module not found");
  }

  // Step 3: Check travelerId
  if (record.travelerId !== null) {
    throw new Error("Data can't be deleted because travelerId is not null");
  }

  // Step 4: Perform the delete
  const deleteQuery = `
    mutation DeleteModule($id: String!) {
      module_delete(id: $id)
    }
  `;

  const deleteResponse = await dataConnect.executeGraphql(deleteQuery, {
    variables: { id },
  });

  return deleteResponse.data;
};
