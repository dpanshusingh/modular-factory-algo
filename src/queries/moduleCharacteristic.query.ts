import { dataConnect } from "../config/dataConnectClient";

type Float = number & { __int__: void };

function toFloat(n: number): Float {
  if (!Number.isInteger(n)) {
    throw new Error("Value is not an integer");
  }
  return n as Float;
}

export enum ModuleCharacteristicType {
  squareFeet = "squareFeet",
  linearFeetExteriorWalls = "linearFeetExteriorWalls",
  linearFeetInteriorWalls = "linearFeetInteriorWalls",
  countInteriorWalls = "countInteriorWalls",
  countToilets = "countToilets",
  countSinks = "countSinks",
  countWindows = "countWindows",
  countExteriorDoors = "countExteriorDoors",
  countInteriorDoors = "countInteriorDoors",
  squareFeetExteriorCloseUp = "squareFeetExteriorCloseUp",
  squareFeetRoofing = "squareFeetRoofing",
  linearFeetCabinets = "linearFeetCabinets",
  countElectricalTerminals = "countElectricalTerminals",
  linearFeetFirewall = "linearFeetFirewall",
  countStairs = "countStairs",
  hasHvacDucting = "hasHvacDucting",
}
export interface ModuleCharacteristicInput {
  id: string;
  moduleProfileId: string;
  characteristicType: ModuleCharacteristicType;
  value: number;
}

export const createModuleCharacterstics = async (
  input: ModuleCharacteristicInput
) => {
  const query = `mutation CreateModuleCharacteristic(  
    $id: String!,
    $moduleProfileId: String!,
    $characteristicType: ModuleCharacteristicType!,
    $value: Float!){
 moduleCharacteristic_insert(
      data: {
        id: $id
        moduleProfileId: $moduleProfileId
        characteristicType: $characteristicType
        value: $value
      }
    )
    }`;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

export const CREATE_MODULE_CHARACTERISTIC_MANY = `
  mutation CreateManyModuleCharacteristics(
    $items: [ModuleCharacteristic_Data!]!
  ) {
    moduleCharacteristic_insertMany(data: $items)
  }
`;

export const GET_ALL_MODULE_CHARACTERISTICS = `
  query GetModuleCharacteristics {
    moduleCharacteristics {
      id
      moduleProfileId
      characteristicType
      value
    }
  }
`;

export const getAllModuleChracterstics = async () => {
  const query = `
  query GetModuleCharacteristics {
    moduleCharacteristics {
      id
      moduleProfileId
      characteristicType
      value
    }
  }
`;
  const response = await dataConnect.executeGraphql(query, {});
  return response.data ?? [];
};

export const GET_MODULE_CHARACTERISTICS_BY_ID = async (
  moduleProfileId: string
) => {
  const query = `
    query GetModuleCharacteristicsByProfile($moduleProfileId: String!) {
  moduleCharacteristics(where: { moduleProfile: { id: { eq: $moduleProfileId } } }) {
    id
    characteristicType
    value
    moduleProfile {
      id
      name
      project{
        id
        name
      }
    }
  }
}
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { moduleProfileId },
  });
  return response.data;
};

export const UPDATE_MODULE_CHARACTERISTIC = `
  mutation UpdateModuleCharacteristic(
    $id: String!,
    $moduleProfileId: String,
    $characteristicType: ModuleCharacteristicType,
    $value: Float
  ) {
    moduleCharacteristic_update(
      id: $id,
      data: {
        value: $value,
        characteristicType: $characteristicType,
        moduleProfile: { id: $moduleProfileId }
      }
    )
  }
`;

export const DELETE_MODULE_CHARACTERISTIC = `
  mutation DeleteModuleCharacteristic($id: UUID!) {
        moduleCharacteristic_delete(id: $id)
      }
`;

export const DELETE_MODULE_CHARACTERISTICS_BY_ID = async (
  moduleProfileId: string
) => {
  const query = `
    mutation DeleteModuleCharacteristicsByProfile($moduleProfileId: String!) {
  moduleCharacteristic_deleteMany(where: { moduleProfile: { id: { eq: $moduleProfileId } } })
}
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: { moduleProfileId },
  });
  return response.data;
};
