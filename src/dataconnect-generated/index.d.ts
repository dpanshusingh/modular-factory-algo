import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum NoteType {
  approval = "approval",
  rejection = "rejection",
  photoOnly = "photoOnly",
  move = "move",
  moveRequest = "moveRequest",
  normal = "normal",
};



export interface AddNoteData {
  note_insert: Note_Key;
}

export interface AddNoteVariables {
  id: UUIDString;
  inspectionItemId?: UUIDString | null;
  taskId?: UUIDString | null;
  travelerId?: UUIDString | null;
  text: string;
  type?: NoteType | null;
}

export interface AdhocInspectionItemNote_Key {
  id: UUIDString;
  __typename?: 'AdhocInspectionItemNote_Key';
}

export interface AdhocInspectionItem_Key {
  id: UUIDString;
  __typename?: 'AdhocInspectionItem_Key';
}

export interface AdhocTaskNote_Key {
  id: UUIDString;
  __typename?: 'AdhocTaskNote_Key';
}

export interface AdhocTask_Key {
  id: UUIDString;
  __typename?: 'AdhocTask_Key';
}

export interface CreateStationData {
  station_insert: Station_Key;
}

export interface CreateStationVariables {
  id: UUIDString;
  taskTemplateId?: UUIDString | null;
  name?: string | null;
  order?: number | null;
  doesReceiveTravelers?: boolean | null;
}

export interface CreateTravelerTemplateData {
  travelerTemplate_insert: TravelerTemplate_Key;
}

export interface CreateTravelerTemplateVariables {
  id: UUIDString;
  name?: string | null;
}

export interface Employee_Key {
  id: UUIDString;
  __typename?: 'Employee_Key';
}

export interface GetCurrentTravelerStationsData {
  travelerStations: ({
    id: UUIDString;
    stationId: UUIDString;
    travelerId: UUIDString;
    leadInspectionProgress?: number | null;
    qamInspectionProgress?: number | null;
    taskProgress?: number | null;
    isCurrent?: boolean | null;
  } & TravelerStation_Key)[];
}

export interface GetCurrentTravelerStationsVariables {
  travelerId: UUIDString;
}

export interface GetNotesByTravelerData {
  notes: ({
    id: UUIDString;
    inspectionItemId?: UUIDString | null;
    taskId?: UUIDString | null;
    travelerId?: UUIDString | null;
    text?: string | null;
    type?: NoteType | null;
  } & Note_Key)[];
}

export interface GetNotesByTravelerVariables {
  travelerId: UUIDString;
}

export interface GetNotesData {
  notes: ({
    id: UUIDString;
    inspectionItemId?: UUIDString | null;
    taskId?: UUIDString | null;
    travelerId?: UUIDString | null;
    text?: string | null;
    type?: NoteType | null;
  } & Note_Key)[];
}

export interface GetStationByIdData {
  station?: {
    id: UUIDString;
    taskTemplateId?: UUIDString | null;
    name?: string | null;
    order?: number | null;
    doesReceiveTravelers?: boolean | null;
  } & Station_Key;
}

export interface GetStationByIdVariables {
  id: UUIDString;
}

export interface GetStationsData {
  stations: ({
    id: UUIDString;
    taskTemplateId?: UUIDString | null;
    name?: string | null;
    order?: number | null;
    doesReceiveTravelers?: boolean | null;
  } & Station_Key)[];
}

export interface GetTravelerByIdData {
  traveler?: {
    id: UUIDString;
    moduleProfileId?: string | null;
    travelerTemplateId: UUIDString;
    isShipped?: boolean | null;
    notesRequiredUpload?: boolean | null;
    serialNumber?: string | null;
  } & Traveler_Key;
}

export interface GetTravelerByIdVariables {
  id: UUIDString;
}

export interface GetTravelerData {
  travelers: ({
    id: UUIDString;
    isShipped?: boolean | null;
    notesRequiredUpload?: boolean | null;
    serialNumber?: string | null;
  } & Traveler_Key)[];
}

export interface GetTravelerStationsByTravelerData {
  travelerStations: ({
    id: UUIDString;
    stationId: UUIDString;
    travelerId: UUIDString;
    leadInspectionProgress?: number | null;
    qamInspectionProgress?: number | null;
    taskProgress?: number | null;
    isCurrent?: boolean | null;
  } & TravelerStation_Key)[];
}

export interface GetTravelerStationsByTravelerVariables {
  travelerId: UUIDString;
}

export interface GetTravelerStationsData {
  travelerStations: ({
    id: UUIDString;
    stationId: UUIDString;
    travelerId: UUIDString;
    leadInspectionProgress?: number | null;
    qamInspectionProgress?: number | null;
    taskProgress?: number | null;
    isCurrent?: boolean | null;
  } & TravelerStation_Key)[];
}

export interface GetTravelerStationsQamProgressData {
  travelerStations: ({
    id: UUIDString;
    qamInspectionProgress?: number | null;
  } & TravelerStation_Key)[];
}

export interface GetTravelerStationsQamProgressVariables {
  stationId: UUIDString;
}

export interface GetTravelerTemplatesData {
  travelerTemplates: ({
    id: UUIDString;
    name?: string | null;
  } & TravelerTemplate_Key)[];
}

export interface InspectionArea_Key {
  id: UUIDString;
  __typename?: 'InspectionArea_Key';
}

export interface InspectionItemFile_Key {
  id: UUIDString;
  __typename?: 'InspectionItemFile_Key';
}

export interface InspectionItemNote_Key {
  id: UUIDString;
  __typename?: 'InspectionItemNote_Key';
}

export interface InspectionItemTemplate_Key {
  id: UUIDString;
  __typename?: 'InspectionItemTemplate_Key';
}

export interface InspectionItem_Key {
  id: UUIDString;
  __typename?: 'InspectionItem_Key';
}

export interface Issue_Key {
  id: UUIDString;
  __typename?: 'Issue_Key';
}

export interface ManagedFile_Key {
  id: UUIDString;
  __typename?: 'ManagedFile_Key';
}

export interface ModuleCharacteristic_Key {
  id: UUIDString;
  __typename?: 'ModuleCharacteristic_Key';
}

export interface ModuleProfile_Key {
  id: string;
  __typename?: 'ModuleProfile_Key';
}

export interface Note_Key {
  id: UUIDString;
  __typename?: 'Note_Key';
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface Station_Key {
  id: UUIDString;
  __typename?: 'Station_Key';
}

export interface TaskFile_Key {
  id: UUIDString;
  __typename?: 'TaskFile_Key';
}

export interface TaskNote_Key {
  id: UUIDString;
  __typename?: 'TaskNote_Key';
}

export interface TaskTemplate_Key {
  id: UUIDString;
  __typename?: 'TaskTemplate_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface TimeLog_Key {
  id: UUIDString;
  __typename?: 'TimeLog_Key';
}

export interface Timelog_Key {
  id: UUIDString;
  __typename?: 'Timelog_Key';
}

export interface TravelerData {
  traveler_insert: Traveler_Key;
}

export interface TravelerStationData {
  travelerStation_insert: TravelerStation_Key;
}

export interface TravelerStationVariables {
  id: UUIDString;
  stationId: UUIDString;
  travelerId: UUIDString;
  isCurrent?: boolean | null;
  leadInspectionProgress?: number | null;
  qamInspectionProgress?: number | null;
  taskProgress?: number | null;
}

export interface TravelerStation_Key {
  id: UUIDString;
  __typename?: 'TravelerStation_Key';
}

export interface TravelerTemplate_Key {
  id: UUIDString;
  __typename?: 'TravelerTemplate_Key';
}

export interface TravelerVariables {
  id: UUIDString;
  moduleProfileId?: string | null;
  travelerTemplateId: UUIDString;
  isShipped?: boolean | null;
  notesRequiredUpload?: boolean | null;
  serialNumber?: string | null;
}

export interface Traveler_Key {
  id: UUIDString;
  __typename?: 'Traveler_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface WorkUnitWorker_Key {
  id: UUIDString;
  __typename?: 'WorkUnitWorker_Key';
}

export interface WorkUnit_Key {
  id: UUIDString;
  __typename?: 'WorkUnit_Key';
}

export interface Worker_Key {
  id: UUIDString;
  __typename?: 'Worker_Key';
}

interface AddNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNoteVariables): MutationRef<AddNoteData, AddNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddNoteVariables): MutationRef<AddNoteData, AddNoteVariables>;
  operationName: string;
}
export const addNoteRef: AddNoteRef;

export function addNote(vars: AddNoteVariables): MutationPromise<AddNoteData, AddNoteVariables>;
export function addNote(dc: DataConnect, vars: AddNoteVariables): MutationPromise<AddNoteData, AddNoteVariables>;

interface CreateTravelerTemplateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTravelerTemplateVariables): MutationRef<CreateTravelerTemplateData, CreateTravelerTemplateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTravelerTemplateVariables): MutationRef<CreateTravelerTemplateData, CreateTravelerTemplateVariables>;
  operationName: string;
}
export const createTravelerTemplateRef: CreateTravelerTemplateRef;

export function createTravelerTemplate(vars: CreateTravelerTemplateVariables): MutationPromise<CreateTravelerTemplateData, CreateTravelerTemplateVariables>;
export function createTravelerTemplate(dc: DataConnect, vars: CreateTravelerTemplateVariables): MutationPromise<CreateTravelerTemplateData, CreateTravelerTemplateVariables>;

interface CreateStationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStationVariables): MutationRef<CreateStationData, CreateStationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateStationVariables): MutationRef<CreateStationData, CreateStationVariables>;
  operationName: string;
}
export const createStationRef: CreateStationRef;

export function createStation(vars: CreateStationVariables): MutationPromise<CreateStationData, CreateStationVariables>;
export function createStation(dc: DataConnect, vars: CreateStationVariables): MutationPromise<CreateStationData, CreateStationVariables>;

interface TravelerStationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: TravelerStationVariables): MutationRef<TravelerStationData, TravelerStationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: TravelerStationVariables): MutationRef<TravelerStationData, TravelerStationVariables>;
  operationName: string;
}
export const travelerStationRef: TravelerStationRef;

export function travelerStation(vars: TravelerStationVariables): MutationPromise<TravelerStationData, TravelerStationVariables>;
export function travelerStation(dc: DataConnect, vars: TravelerStationVariables): MutationPromise<TravelerStationData, TravelerStationVariables>;

interface TravelerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: TravelerVariables): MutationRef<TravelerData, TravelerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: TravelerVariables): MutationRef<TravelerData, TravelerVariables>;
  operationName: string;
}
export const travelerRef: TravelerRef;

export function traveler(vars: TravelerVariables): MutationPromise<TravelerData, TravelerVariables>;
export function traveler(dc: DataConnect, vars: TravelerVariables): MutationPromise<TravelerData, TravelerVariables>;

interface GetNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetNotesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetNotesData, undefined>;
  operationName: string;
}
export const getNotesRef: GetNotesRef;

export function getNotes(): QueryPromise<GetNotesData, undefined>;
export function getNotes(dc: DataConnect): QueryPromise<GetNotesData, undefined>;

interface GetNotesByTravelerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotesByTravelerVariables): QueryRef<GetNotesByTravelerData, GetNotesByTravelerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetNotesByTravelerVariables): QueryRef<GetNotesByTravelerData, GetNotesByTravelerVariables>;
  operationName: string;
}
export const getNotesByTravelerRef: GetNotesByTravelerRef;

export function getNotesByTraveler(vars: GetNotesByTravelerVariables): QueryPromise<GetNotesByTravelerData, GetNotesByTravelerVariables>;
export function getNotesByTraveler(dc: DataConnect, vars: GetNotesByTravelerVariables): QueryPromise<GetNotesByTravelerData, GetNotesByTravelerVariables>;

interface GetTravelerTemplatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetTravelerTemplatesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetTravelerTemplatesData, undefined>;
  operationName: string;
}
export const getTravelerTemplatesRef: GetTravelerTemplatesRef;

export function getTravelerTemplates(): QueryPromise<GetTravelerTemplatesData, undefined>;
export function getTravelerTemplates(dc: DataConnect): QueryPromise<GetTravelerTemplatesData, undefined>;

interface GetStationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetStationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetStationsData, undefined>;
  operationName: string;
}
export const getStationsRef: GetStationsRef;

export function getStations(): QueryPromise<GetStationsData, undefined>;
export function getStations(dc: DataConnect): QueryPromise<GetStationsData, undefined>;

interface GetStationByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStationByIdVariables): QueryRef<GetStationByIdData, GetStationByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStationByIdVariables): QueryRef<GetStationByIdData, GetStationByIdVariables>;
  operationName: string;
}
export const getStationByIdRef: GetStationByIdRef;

export function getStationById(vars: GetStationByIdVariables): QueryPromise<GetStationByIdData, GetStationByIdVariables>;
export function getStationById(dc: DataConnect, vars: GetStationByIdVariables): QueryPromise<GetStationByIdData, GetStationByIdVariables>;

interface GetTravelerRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetTravelerData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetTravelerData, undefined>;
  operationName: string;
}
export const getTravelerRef: GetTravelerRef;

export function getTraveler(): QueryPromise<GetTravelerData, undefined>;
export function getTraveler(dc: DataConnect): QueryPromise<GetTravelerData, undefined>;

interface GetTravelerByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTravelerByIdVariables): QueryRef<GetTravelerByIdData, GetTravelerByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTravelerByIdVariables): QueryRef<GetTravelerByIdData, GetTravelerByIdVariables>;
  operationName: string;
}
export const getTravelerByIdRef: GetTravelerByIdRef;

export function getTravelerById(vars: GetTravelerByIdVariables): QueryPromise<GetTravelerByIdData, GetTravelerByIdVariables>;
export function getTravelerById(dc: DataConnect, vars: GetTravelerByIdVariables): QueryPromise<GetTravelerByIdData, GetTravelerByIdVariables>;

interface GetTravelerStationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetTravelerStationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetTravelerStationsData, undefined>;
  operationName: string;
}
export const getTravelerStationsRef: GetTravelerStationsRef;

export function getTravelerStations(): QueryPromise<GetTravelerStationsData, undefined>;
export function getTravelerStations(dc: DataConnect): QueryPromise<GetTravelerStationsData, undefined>;

interface GetTravelerStationsByTravelerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTravelerStationsByTravelerVariables): QueryRef<GetTravelerStationsByTravelerData, GetTravelerStationsByTravelerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTravelerStationsByTravelerVariables): QueryRef<GetTravelerStationsByTravelerData, GetTravelerStationsByTravelerVariables>;
  operationName: string;
}
export const getTravelerStationsByTravelerRef: GetTravelerStationsByTravelerRef;

export function getTravelerStationsByTraveler(vars: GetTravelerStationsByTravelerVariables): QueryPromise<GetTravelerStationsByTravelerData, GetTravelerStationsByTravelerVariables>;
export function getTravelerStationsByTraveler(dc: DataConnect, vars: GetTravelerStationsByTravelerVariables): QueryPromise<GetTravelerStationsByTravelerData, GetTravelerStationsByTravelerVariables>;

interface GetCurrentTravelerStationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCurrentTravelerStationsVariables): QueryRef<GetCurrentTravelerStationsData, GetCurrentTravelerStationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCurrentTravelerStationsVariables): QueryRef<GetCurrentTravelerStationsData, GetCurrentTravelerStationsVariables>;
  operationName: string;
}
export const getCurrentTravelerStationsRef: GetCurrentTravelerStationsRef;

export function getCurrentTravelerStations(vars: GetCurrentTravelerStationsVariables): QueryPromise<GetCurrentTravelerStationsData, GetCurrentTravelerStationsVariables>;
export function getCurrentTravelerStations(dc: DataConnect, vars: GetCurrentTravelerStationsVariables): QueryPromise<GetCurrentTravelerStationsData, GetCurrentTravelerStationsVariables>;

interface GetTravelerStationsQamProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTravelerStationsQamProgressVariables): QueryRef<GetTravelerStationsQamProgressData, GetTravelerStationsQamProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTravelerStationsQamProgressVariables): QueryRef<GetTravelerStationsQamProgressData, GetTravelerStationsQamProgressVariables>;
  operationName: string;
}
export const getTravelerStationsQamProgressRef: GetTravelerStationsQamProgressRef;

export function getTravelerStationsQamProgress(vars: GetTravelerStationsQamProgressVariables): QueryPromise<GetTravelerStationsQamProgressData, GetTravelerStationsQamProgressVariables>;
export function getTravelerStationsQamProgress(dc: DataConnect, vars: GetTravelerStationsQamProgressVariables): QueryPromise<GetTravelerStationsQamProgressData, GetTravelerStationsQamProgressVariables>;

