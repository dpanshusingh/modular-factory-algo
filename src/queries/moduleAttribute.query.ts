import { dataConnect } from "../config/dataConnectClient";

type Int = number & { __int__: void };

function toInt(n: number): Int {
  if (!Number.isInteger(n)) {
    throw new Error("Value is not an integer");
  }
  return n as Int;
}

export enum moduleAttributeType {
  number = "number",
  boolean = "boolean",
}

export interface moduleAttributeInput {
  id: string;
  name: string;
  moduleType: moduleAttributeType;
}

export const createModuleAttribute = async (
  input: moduleAttributeInput & { id: string }
) => {
  const query = `
    mutation CreateModuleAttribute(
      $id: String!,
      $name: String!,
      $moduleAttributeType: ModuleAttributeType!
    ) {
      moduleAttribute_insert(
        data: { 
          id: $id, 
          name: $name, 
          moduleAttributeType: $moduleAttributeType
        }
      )
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: {
      id: input.id,
      name: input.name,
      moduleAttributeType: input.moduleType, // "number" | "boolean"
    },
  });

  return response.data;
};

// Read all
export const getAllModuleAttribute = async () => {
  const query = `
    query {
      moduleAttributes {
        id
        name
        moduleAttributeType
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

export const UpdateModuleAttributeOrder = async (
  id: string,
  input: Partial<moduleAttributeInput>
) => {
  const query = `
    mutation UpdateModuleAttribute($id: String!, $data: station_update_input!) {
      moduleAttribute_update(id: $id, data: $data)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id, data: input },
  });
  return response.data ?? null;
};

// Read one
export const getModuleAttributeById = async (id: string) => {
  const query = `
    query GetModuleAttributeById($id: String!) {
      moduleAttribute(id: $id){
      name
      moduleAttributeType, 
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};

export const UpdateModuleAttribute = async (
  id: string,
  input: Partial<moduleAttributeInput>
) => {
  const query = `
    mutation UpdateModuleAttribute(
      $id: String!,
      $name: String,
      $moduleAttributeType: ModuleAttributeType
    ) {
      moduleAttribute_update(
        id: $id,
        data: {
          ${input.name !== undefined ? "name: $name" : ""}
          ${
            input.moduleType !== undefined
              ? "moduleAttributeType: $moduleAttributeType"
              : ""
          }
        }
      )
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: {
      id,
      name: input.name,
      moduleAttributeType: input.moduleType,
    },
  });

  return response.data;
};

// Delete
export const deleteModuleAttribute = async (id: string) => {
  const query = `
    mutation DeleteModuleAttribute($id: String!) {
        moduleAttribute_delete(id: $id)
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return response.data;
};
