import { dataConnect } from "../config/dataConnectClient";

type Int = number & { __int__: void };

function toInt(n: number): Int {
  if (!Number.isInteger(n)) {
    throw new Error("Value is not an integer");
  }
  return n as Int;
}

export type LeadType = 
'closeup'  |
'drywall' |
'electrical' |
'exterior' |
'floors' |
'hvac' |
'insulation' |
'interior' |
'office' |
'paint' |
'plumbing' |
'roofing' |
'shipping' |
'walls' ;

export type ModuleCharacteristicType = 
'squareFeet' |
'linearFeetExteriorWalls' |
'linearFeetInteriorWalls' |
'countInteriorWalls' |
'countToilets' |
'countSinks' |
'countWindows' |
'countExteriorDoors' |
'countInteriorDoors' |
'squareFeetExteriorCloseUp' |
'squareFeetRoofing' |
'linearFeetCabinets' |
'countElectricalTerminals' |
'linearFeetFirewall' |
'countStairs' |
'hasHvacDucting'

export interface TaskTemplateInput {
    id: string;
    isPhotoRequired: boolean;
    isVideoRequired: boolean;
    leadType:LeadType;
    maxWorkers: Int;
    minWorkers: Int;
    moduleCharacteristicType: ModuleCharacteristicType;
    name: string;
    order: Int;
    rankedSkills: string[];
    stationId: string;
}

// Create
export const createTaskTemplate = async (input: TaskTemplateInput) => {
const query = `
    mutation CreateTaskTemplate(
    $id: String!, 
    $isPhotRequired: Boolean!, 
    $isVideoRequired: Boolean!, 
    $leadType: LeadType!, 
    $maxWorkers: Int!,
    $minWorkers: Int!,
    $moduleCharacteristicsType: ModuleCharacteristicType!,
    $name: String;
    $order: Int!;
    $rankedSkills: [];
    $stationId: String!
    ) {
    taskTemplate_insert(
        data: { 
        id: $id, 
        isPhotRequired: $isPhotRequired, 
        isVideoRequired: $isVideoRequired 
        leadType: $leadType 
        maxWorkers: $maxWorkers
        minWorkers: $minWorkers
        moduleCharacteristicsType:$moduleCharacteristicsType
        name: $name
        order:$order
        rankedSkills:$rankedSkills
        station: {id: $stationId}
    })
}
`;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

// // Read all
// export const getAllStations = async () => {
//   const query = `
//     query {
//       stations {
//         id
//         doesReceiveTravelers
//         order
//         name
//         inspectionArea { id name order}
//       }
//     }
//   `;
//   const response = await dataConnect.executeGraphql(query, {});
//   return response.data ?? [];
// };

// // Read one
// export const getStationById = async (id: string) => {
//   const query = `
//     query GetStationById($id: String!) {
//       station(id: $id){
//         id
//         doesReceiveTravelers
//         order
//         name
//         inspectionArea { id name order}
//       }
//     }
//   `;
//   const response = await dataConnect.executeGraphql(query, {
//     variables: { id },
//   });
//   return response.data;
// };

// // Update Station area
// export const updateStation = async (
//   id: string,
//   input: Partial<StationInput>
// ) => {
// const query = `
// mutation UpdateStation($id: String!, $name: String!, $doesReceiveTravelers: Boolean!, $order: Int!, $inspectionAreaId: String!) {
//     station_update(
//         id: $id
//         data: {
//             doesReceiveTravelers: $doesReceiveTravelers
//             name: $name
//             order: $order
//             inspectionArea: { id: $inspectionAreaId }
//         }
//     )
// }
// `;


//   const response = await dataConnect.executeGraphql(query, {
//     variables: { id, ...input },
//   });

//   return response.data;
// };

// // Delete
// export const deleteStation = async (id: string) => {
//   const query = `
//     mutation DeleteStation($id: String!) {
//         station_delete(id: $id)
//     }
//   `;
//   const response = await dataConnect.executeGraphql(query, {
//     variables: { id },
//   });
//   return response.data;
// };