import { dataConnect } from "../config/dataConnectClient";

export const CREATE_MODULE_CHARACTERISTIC = `
  mutation CreateModuleCharacteristic(
    $id: String!,
    $moduleProfileId: String!,
    $characteristicType: ModuleCharacteristicType,
    $value: Float
  ) {
    moduleCharacteristic_insert(
      data: {
        id: $id
        moduleProfileId: $moduleProfileId
        characteristicType: $characteristicType
        value: $value
      }
    )
  }
`;

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

// export const GET_MODULE_CHARACTERISTIC_BY_ID = `
//   query GetModuleCharacteristicById($id: UUID!) {
//     moduleCharacteristic_by_pk(id: $id) {
//       id
//       moduleProfileId
//       characteristicType
//       value
//     }
//   }
// `;

export const getModuleCharacteristicsById = async (id: string) => {
  const query = `
    query GetModuleCharacteristics($id: String!) {
      moduleCharacteristics(ModuleCharacteristic_Filter: $id) {
        id
        characteristicType
        value
      }
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: {
      id // wrap the plain string in a filter object
    },
  });
  return response.data;
};



export const UPDATE_MODULE_CHARACTERISTIC = `
   mutation UpdateModuleCharacteristic(
        $id: UUID!,
        $value: Float,
        $characteristicType: ModuleCharacteristicType
      ) {
        moduleCharacteristic_update(
          id: $id,
          data: {
            value: $value,
            characteristicType: $characteristicType
          }
        )
      }
`;

export const DELETE_MODULE_CHARACTERISTIC = `
  mutation DeleteModuleCharacteristic($id: UUID!) {
        moduleCharacteristic_delete(id: $id)
      }
`;
