import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const NoteType = {
  approval: "approval",
  rejection: "rejection",
  photoOnly: "photoOnly",
  move: "move",
  moveRequest: "moveRequest",
  normal: "normal",
}

export const connectorConfig = {
  connector: 'vos-web',
  service: 'vos-web-1',
  location: 'us-central1'
};

export const addNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNote', inputVars);
}
addNoteRef.operationName = 'AddNote';

export function addNote(dcOrVars, vars) {
  return executeMutation(addNoteRef(dcOrVars, vars));
}

export const createTravelerTemplateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTravelerTemplate', inputVars);
}
createTravelerTemplateRef.operationName = 'CreateTravelerTemplate';

export function createTravelerTemplate(dcOrVars, vars) {
  return executeMutation(createTravelerTemplateRef(dcOrVars, vars));
}

export const createStationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStation', inputVars);
}
createStationRef.operationName = 'CreateStation';

export function createStation(dcOrVars, vars) {
  return executeMutation(createStationRef(dcOrVars, vars));
}

export const travelerStationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TravelerStation', inputVars);
}
travelerStationRef.operationName = 'TravelerStation';

export function travelerStation(dcOrVars, vars) {
  return executeMutation(travelerStationRef(dcOrVars, vars));
}

export const travelerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'traveler', inputVars);
}
travelerRef.operationName = 'traveler';

export function traveler(dcOrVars, vars) {
  return executeMutation(travelerRef(dcOrVars, vars));
}

export const getNotesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetNotes');
}
getNotesRef.operationName = 'GetNotes';

export function getNotes(dc) {
  return executeQuery(getNotesRef(dc));
}

export const getNotesByTravelerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetNotesByTraveler', inputVars);
}
getNotesByTravelerRef.operationName = 'GetNotesByTraveler';

export function getNotesByTraveler(dcOrVars, vars) {
  return executeQuery(getNotesByTravelerRef(dcOrVars, vars));
}

export const getTravelerTemplatesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTravelerTemplates');
}
getTravelerTemplatesRef.operationName = 'GetTravelerTemplates';

export function getTravelerTemplates(dc) {
  return executeQuery(getTravelerTemplatesRef(dc));
}

export const getStationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStations');
}
getStationsRef.operationName = 'GetStations';

export function getStations(dc) {
  return executeQuery(getStationsRef(dc));
}

export const getStationByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStationById', inputVars);
}
getStationByIdRef.operationName = 'GetStationById';

export function getStationById(dcOrVars, vars) {
  return executeQuery(getStationByIdRef(dcOrVars, vars));
}

export const getTravelerRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTraveler');
}
getTravelerRef.operationName = 'GetTraveler';

export function getTraveler(dc) {
  return executeQuery(getTravelerRef(dc));
}

export const getTravelerByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTravelerById', inputVars);
}
getTravelerByIdRef.operationName = 'GetTravelerById';

export function getTravelerById(dcOrVars, vars) {
  return executeQuery(getTravelerByIdRef(dcOrVars, vars));
}

export const getTravelerStationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTravelerStations');
}
getTravelerStationsRef.operationName = 'GetTravelerStations';

export function getTravelerStations(dc) {
  return executeQuery(getTravelerStationsRef(dc));
}

export const getTravelerStationsByTravelerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTravelerStationsByTraveler', inputVars);
}
getTravelerStationsByTravelerRef.operationName = 'GetTravelerStationsByTraveler';

export function getTravelerStationsByTraveler(dcOrVars, vars) {
  return executeQuery(getTravelerStationsByTravelerRef(dcOrVars, vars));
}

export const getCurrentTravelerStationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentTravelerStations', inputVars);
}
getCurrentTravelerStationsRef.operationName = 'GetCurrentTravelerStations';

export function getCurrentTravelerStations(dcOrVars, vars) {
  return executeQuery(getCurrentTravelerStationsRef(dcOrVars, vars));
}

export const getTravelerStationsQamProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTravelerStationsQamProgress', inputVars);
}
getTravelerStationsQamProgressRef.operationName = 'GetTravelerStationsQamProgress';

export function getTravelerStationsQamProgress(dcOrVars, vars) {
  return executeQuery(getTravelerStationsQamProgressRef(dcOrVars, vars));
}

