# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `vos-web`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetNotes*](#getnotes)
  - [*GetNotesByTraveler*](#getnotesbytraveler)
  - [*GetTravelerTemplates*](#gettravelertemplates)
  - [*GetStations*](#getstations)
  - [*GetStationById*](#getstationbyid)
  - [*GetTraveler*](#gettraveler)
  - [*GetTravelerById*](#gettravelerbyid)
  - [*GetTravelerStations*](#gettravelerstations)
  - [*GetTravelerStationsByTraveler*](#gettravelerstationsbytraveler)
  - [*GetCurrentTravelerStations*](#getcurrenttravelerstations)
  - [*GetTravelerStationsQamProgress*](#gettravelerstationsqamprogress)
- [**Mutations**](#mutations)
  - [*AddNote*](#addnote)
  - [*CreateTravelerTemplate*](#createtravelertemplate)
  - [*CreateStation*](#createstation)
  - [*TravelerStation*](#travelerstation)
  - [*traveler*](#traveler)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `vos-web`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `vos-web` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetNotes
You can execute the `GetNotes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getNotes(): QueryPromise<GetNotesData, undefined>;

interface GetNotesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetNotesData, undefined>;
}
export const getNotesRef: GetNotesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getNotes(dc: DataConnect): QueryPromise<GetNotesData, undefined>;

interface GetNotesRef {
  ...
  (dc: DataConnect): QueryRef<GetNotesData, undefined>;
}
export const getNotesRef: GetNotesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getNotesRef:
```typescript
const name = getNotesRef.operationName;
console.log(name);
```

### Variables
The `GetNotes` query has no variables.
### Return Type
Recall that executing the `GetNotes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetNotesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetNotes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getNotes } from '@dataconnect/generated';


// Call the `getNotes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getNotes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getNotes(dataConnect);

console.log(data.notes);

// Or, you can use the `Promise` API.
getNotes().then((response) => {
  const data = response.data;
  console.log(data.notes);
});
```

### Using `GetNotes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getNotesRef } from '@dataconnect/generated';


// Call the `getNotesRef()` function to get a reference to the query.
const ref = getNotesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getNotesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notes);
});
```

## GetNotesByTraveler
You can execute the `GetNotesByTraveler` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getNotesByTraveler(vars: GetNotesByTravelerVariables): QueryPromise<GetNotesByTravelerData, GetNotesByTravelerVariables>;

interface GetNotesByTravelerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotesByTravelerVariables): QueryRef<GetNotesByTravelerData, GetNotesByTravelerVariables>;
}
export const getNotesByTravelerRef: GetNotesByTravelerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getNotesByTraveler(dc: DataConnect, vars: GetNotesByTravelerVariables): QueryPromise<GetNotesByTravelerData, GetNotesByTravelerVariables>;

interface GetNotesByTravelerRef {
  ...
  (dc: DataConnect, vars: GetNotesByTravelerVariables): QueryRef<GetNotesByTravelerData, GetNotesByTravelerVariables>;
}
export const getNotesByTravelerRef: GetNotesByTravelerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getNotesByTravelerRef:
```typescript
const name = getNotesByTravelerRef.operationName;
console.log(name);
```

### Variables
The `GetNotesByTraveler` query requires an argument of type `GetNotesByTravelerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetNotesByTravelerVariables {
  travelerId: UUIDString;
}
```
### Return Type
Recall that executing the `GetNotesByTraveler` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetNotesByTravelerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetNotesByTraveler`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getNotesByTraveler, GetNotesByTravelerVariables } from '@dataconnect/generated';

// The `GetNotesByTraveler` query requires an argument of type `GetNotesByTravelerVariables`:
const getNotesByTravelerVars: GetNotesByTravelerVariables = {
  travelerId: ..., 
};

// Call the `getNotesByTraveler()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getNotesByTraveler(getNotesByTravelerVars);
// Variables can be defined inline as well.
const { data } = await getNotesByTraveler({ travelerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getNotesByTraveler(dataConnect, getNotesByTravelerVars);

console.log(data.notes);

// Or, you can use the `Promise` API.
getNotesByTraveler(getNotesByTravelerVars).then((response) => {
  const data = response.data;
  console.log(data.notes);
});
```

### Using `GetNotesByTraveler`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getNotesByTravelerRef, GetNotesByTravelerVariables } from '@dataconnect/generated';

// The `GetNotesByTraveler` query requires an argument of type `GetNotesByTravelerVariables`:
const getNotesByTravelerVars: GetNotesByTravelerVariables = {
  travelerId: ..., 
};

// Call the `getNotesByTravelerRef()` function to get a reference to the query.
const ref = getNotesByTravelerRef(getNotesByTravelerVars);
// Variables can be defined inline as well.
const ref = getNotesByTravelerRef({ travelerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getNotesByTravelerRef(dataConnect, getNotesByTravelerVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notes);
});
```

## GetTravelerTemplates
You can execute the `GetTravelerTemplates` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTravelerTemplates(): QueryPromise<GetTravelerTemplatesData, undefined>;

interface GetTravelerTemplatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetTravelerTemplatesData, undefined>;
}
export const getTravelerTemplatesRef: GetTravelerTemplatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTravelerTemplates(dc: DataConnect): QueryPromise<GetTravelerTemplatesData, undefined>;

interface GetTravelerTemplatesRef {
  ...
  (dc: DataConnect): QueryRef<GetTravelerTemplatesData, undefined>;
}
export const getTravelerTemplatesRef: GetTravelerTemplatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTravelerTemplatesRef:
```typescript
const name = getTravelerTemplatesRef.operationName;
console.log(name);
```

### Variables
The `GetTravelerTemplates` query has no variables.
### Return Type
Recall that executing the `GetTravelerTemplates` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTravelerTemplatesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTravelerTemplatesData {
  travelerTemplates: ({
    id: UUIDString;
    name?: string | null;
  } & TravelerTemplate_Key)[];
}
```
### Using `GetTravelerTemplates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTravelerTemplates } from '@dataconnect/generated';


// Call the `getTravelerTemplates()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTravelerTemplates();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTravelerTemplates(dataConnect);

console.log(data.travelerTemplates);

// Or, you can use the `Promise` API.
getTravelerTemplates().then((response) => {
  const data = response.data;
  console.log(data.travelerTemplates);
});
```

### Using `GetTravelerTemplates`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTravelerTemplatesRef } from '@dataconnect/generated';


// Call the `getTravelerTemplatesRef()` function to get a reference to the query.
const ref = getTravelerTemplatesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTravelerTemplatesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.travelerTemplates);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.travelerTemplates);
});
```

## GetStations
You can execute the `GetStations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStations(): QueryPromise<GetStationsData, undefined>;

interface GetStationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetStationsData, undefined>;
}
export const getStationsRef: GetStationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStations(dc: DataConnect): QueryPromise<GetStationsData, undefined>;

interface GetStationsRef {
  ...
  (dc: DataConnect): QueryRef<GetStationsData, undefined>;
}
export const getStationsRef: GetStationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStationsRef:
```typescript
const name = getStationsRef.operationName;
console.log(name);
```

### Variables
The `GetStations` query has no variables.
### Return Type
Recall that executing the `GetStations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStationsData {
  stations: ({
    id: UUIDString;
    taskTemplateId?: UUIDString | null;
    name?: string | null;
    order?: number | null;
    doesReceiveTravelers?: boolean | null;
  } & Station_Key)[];
}
```
### Using `GetStations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStations } from '@dataconnect/generated';


// Call the `getStations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStations(dataConnect);

console.log(data.stations);

// Or, you can use the `Promise` API.
getStations().then((response) => {
  const data = response.data;
  console.log(data.stations);
});
```

### Using `GetStations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStationsRef } from '@dataconnect/generated';


// Call the `getStationsRef()` function to get a reference to the query.
const ref = getStationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.stations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.stations);
});
```

## GetStationById
You can execute the `GetStationById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStationById(vars: GetStationByIdVariables): QueryPromise<GetStationByIdData, GetStationByIdVariables>;

interface GetStationByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStationByIdVariables): QueryRef<GetStationByIdData, GetStationByIdVariables>;
}
export const getStationByIdRef: GetStationByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStationById(dc: DataConnect, vars: GetStationByIdVariables): QueryPromise<GetStationByIdData, GetStationByIdVariables>;

interface GetStationByIdRef {
  ...
  (dc: DataConnect, vars: GetStationByIdVariables): QueryRef<GetStationByIdData, GetStationByIdVariables>;
}
export const getStationByIdRef: GetStationByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStationByIdRef:
```typescript
const name = getStationByIdRef.operationName;
console.log(name);
```

### Variables
The `GetStationById` query requires an argument of type `GetStationByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStationByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetStationById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStationByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStationByIdData {
  station?: {
    id: UUIDString;
    taskTemplateId?: UUIDString | null;
    name?: string | null;
    order?: number | null;
    doesReceiveTravelers?: boolean | null;
  } & Station_Key;
}
```
### Using `GetStationById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStationById, GetStationByIdVariables } from '@dataconnect/generated';

// The `GetStationById` query requires an argument of type `GetStationByIdVariables`:
const getStationByIdVars: GetStationByIdVariables = {
  id: ..., 
};

// Call the `getStationById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStationById(getStationByIdVars);
// Variables can be defined inline as well.
const { data } = await getStationById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStationById(dataConnect, getStationByIdVars);

console.log(data.station);

// Or, you can use the `Promise` API.
getStationById(getStationByIdVars).then((response) => {
  const data = response.data;
  console.log(data.station);
});
```

### Using `GetStationById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStationByIdRef, GetStationByIdVariables } from '@dataconnect/generated';

// The `GetStationById` query requires an argument of type `GetStationByIdVariables`:
const getStationByIdVars: GetStationByIdVariables = {
  id: ..., 
};

// Call the `getStationByIdRef()` function to get a reference to the query.
const ref = getStationByIdRef(getStationByIdVars);
// Variables can be defined inline as well.
const ref = getStationByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStationByIdRef(dataConnect, getStationByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.station);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.station);
});
```

## GetTraveler
You can execute the `GetTraveler` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTraveler(): QueryPromise<GetTravelerData, undefined>;

interface GetTravelerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetTravelerData, undefined>;
}
export const getTravelerRef: GetTravelerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTraveler(dc: DataConnect): QueryPromise<GetTravelerData, undefined>;

interface GetTravelerRef {
  ...
  (dc: DataConnect): QueryRef<GetTravelerData, undefined>;
}
export const getTravelerRef: GetTravelerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTravelerRef:
```typescript
const name = getTravelerRef.operationName;
console.log(name);
```

### Variables
The `GetTraveler` query has no variables.
### Return Type
Recall that executing the `GetTraveler` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTravelerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTravelerData {
  travelers: ({
    id: UUIDString;
    isShipped?: boolean | null;
    notesRequiredUpload?: boolean | null;
    serialNumber?: string | null;
  } & Traveler_Key)[];
}
```
### Using `GetTraveler`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTraveler } from '@dataconnect/generated';


// Call the `getTraveler()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTraveler();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTraveler(dataConnect);

console.log(data.travelers);

// Or, you can use the `Promise` API.
getTraveler().then((response) => {
  const data = response.data;
  console.log(data.travelers);
});
```

### Using `GetTraveler`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTravelerRef } from '@dataconnect/generated';


// Call the `getTravelerRef()` function to get a reference to the query.
const ref = getTravelerRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTravelerRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.travelers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.travelers);
});
```

## GetTravelerById
You can execute the `GetTravelerById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTravelerById(vars: GetTravelerByIdVariables): QueryPromise<GetTravelerByIdData, GetTravelerByIdVariables>;

interface GetTravelerByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTravelerByIdVariables): QueryRef<GetTravelerByIdData, GetTravelerByIdVariables>;
}
export const getTravelerByIdRef: GetTravelerByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTravelerById(dc: DataConnect, vars: GetTravelerByIdVariables): QueryPromise<GetTravelerByIdData, GetTravelerByIdVariables>;

interface GetTravelerByIdRef {
  ...
  (dc: DataConnect, vars: GetTravelerByIdVariables): QueryRef<GetTravelerByIdData, GetTravelerByIdVariables>;
}
export const getTravelerByIdRef: GetTravelerByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTravelerByIdRef:
```typescript
const name = getTravelerByIdRef.operationName;
console.log(name);
```

### Variables
The `GetTravelerById` query requires an argument of type `GetTravelerByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTravelerByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetTravelerById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTravelerByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetTravelerById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTravelerById, GetTravelerByIdVariables } from '@dataconnect/generated';

// The `GetTravelerById` query requires an argument of type `GetTravelerByIdVariables`:
const getTravelerByIdVars: GetTravelerByIdVariables = {
  id: ..., 
};

// Call the `getTravelerById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTravelerById(getTravelerByIdVars);
// Variables can be defined inline as well.
const { data } = await getTravelerById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTravelerById(dataConnect, getTravelerByIdVars);

console.log(data.traveler);

// Or, you can use the `Promise` API.
getTravelerById(getTravelerByIdVars).then((response) => {
  const data = response.data;
  console.log(data.traveler);
});
```

### Using `GetTravelerById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTravelerByIdRef, GetTravelerByIdVariables } from '@dataconnect/generated';

// The `GetTravelerById` query requires an argument of type `GetTravelerByIdVariables`:
const getTravelerByIdVars: GetTravelerByIdVariables = {
  id: ..., 
};

// Call the `getTravelerByIdRef()` function to get a reference to the query.
const ref = getTravelerByIdRef(getTravelerByIdVars);
// Variables can be defined inline as well.
const ref = getTravelerByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTravelerByIdRef(dataConnect, getTravelerByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.traveler);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.traveler);
});
```

## GetTravelerStations
You can execute the `GetTravelerStations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTravelerStations(): QueryPromise<GetTravelerStationsData, undefined>;

interface GetTravelerStationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetTravelerStationsData, undefined>;
}
export const getTravelerStationsRef: GetTravelerStationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTravelerStations(dc: DataConnect): QueryPromise<GetTravelerStationsData, undefined>;

interface GetTravelerStationsRef {
  ...
  (dc: DataConnect): QueryRef<GetTravelerStationsData, undefined>;
}
export const getTravelerStationsRef: GetTravelerStationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTravelerStationsRef:
```typescript
const name = getTravelerStationsRef.operationName;
console.log(name);
```

### Variables
The `GetTravelerStations` query has no variables.
### Return Type
Recall that executing the `GetTravelerStations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTravelerStationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetTravelerStations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTravelerStations } from '@dataconnect/generated';


// Call the `getTravelerStations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTravelerStations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTravelerStations(dataConnect);

console.log(data.travelerStations);

// Or, you can use the `Promise` API.
getTravelerStations().then((response) => {
  const data = response.data;
  console.log(data.travelerStations);
});
```

### Using `GetTravelerStations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTravelerStationsRef } from '@dataconnect/generated';


// Call the `getTravelerStationsRef()` function to get a reference to the query.
const ref = getTravelerStationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTravelerStationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.travelerStations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.travelerStations);
});
```

## GetTravelerStationsByTraveler
You can execute the `GetTravelerStationsByTraveler` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTravelerStationsByTraveler(vars: GetTravelerStationsByTravelerVariables): QueryPromise<GetTravelerStationsByTravelerData, GetTravelerStationsByTravelerVariables>;

interface GetTravelerStationsByTravelerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTravelerStationsByTravelerVariables): QueryRef<GetTravelerStationsByTravelerData, GetTravelerStationsByTravelerVariables>;
}
export const getTravelerStationsByTravelerRef: GetTravelerStationsByTravelerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTravelerStationsByTraveler(dc: DataConnect, vars: GetTravelerStationsByTravelerVariables): QueryPromise<GetTravelerStationsByTravelerData, GetTravelerStationsByTravelerVariables>;

interface GetTravelerStationsByTravelerRef {
  ...
  (dc: DataConnect, vars: GetTravelerStationsByTravelerVariables): QueryRef<GetTravelerStationsByTravelerData, GetTravelerStationsByTravelerVariables>;
}
export const getTravelerStationsByTravelerRef: GetTravelerStationsByTravelerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTravelerStationsByTravelerRef:
```typescript
const name = getTravelerStationsByTravelerRef.operationName;
console.log(name);
```

### Variables
The `GetTravelerStationsByTraveler` query requires an argument of type `GetTravelerStationsByTravelerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTravelerStationsByTravelerVariables {
  travelerId: UUIDString;
}
```
### Return Type
Recall that executing the `GetTravelerStationsByTraveler` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTravelerStationsByTravelerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetTravelerStationsByTraveler`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTravelerStationsByTraveler, GetTravelerStationsByTravelerVariables } from '@dataconnect/generated';

// The `GetTravelerStationsByTraveler` query requires an argument of type `GetTravelerStationsByTravelerVariables`:
const getTravelerStationsByTravelerVars: GetTravelerStationsByTravelerVariables = {
  travelerId: ..., 
};

// Call the `getTravelerStationsByTraveler()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTravelerStationsByTraveler(getTravelerStationsByTravelerVars);
// Variables can be defined inline as well.
const { data } = await getTravelerStationsByTraveler({ travelerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTravelerStationsByTraveler(dataConnect, getTravelerStationsByTravelerVars);

console.log(data.travelerStations);

// Or, you can use the `Promise` API.
getTravelerStationsByTraveler(getTravelerStationsByTravelerVars).then((response) => {
  const data = response.data;
  console.log(data.travelerStations);
});
```

### Using `GetTravelerStationsByTraveler`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTravelerStationsByTravelerRef, GetTravelerStationsByTravelerVariables } from '@dataconnect/generated';

// The `GetTravelerStationsByTraveler` query requires an argument of type `GetTravelerStationsByTravelerVariables`:
const getTravelerStationsByTravelerVars: GetTravelerStationsByTravelerVariables = {
  travelerId: ..., 
};

// Call the `getTravelerStationsByTravelerRef()` function to get a reference to the query.
const ref = getTravelerStationsByTravelerRef(getTravelerStationsByTravelerVars);
// Variables can be defined inline as well.
const ref = getTravelerStationsByTravelerRef({ travelerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTravelerStationsByTravelerRef(dataConnect, getTravelerStationsByTravelerVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.travelerStations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.travelerStations);
});
```

## GetCurrentTravelerStations
You can execute the `GetCurrentTravelerStations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCurrentTravelerStations(vars: GetCurrentTravelerStationsVariables): QueryPromise<GetCurrentTravelerStationsData, GetCurrentTravelerStationsVariables>;

interface GetCurrentTravelerStationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCurrentTravelerStationsVariables): QueryRef<GetCurrentTravelerStationsData, GetCurrentTravelerStationsVariables>;
}
export const getCurrentTravelerStationsRef: GetCurrentTravelerStationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentTravelerStations(dc: DataConnect, vars: GetCurrentTravelerStationsVariables): QueryPromise<GetCurrentTravelerStationsData, GetCurrentTravelerStationsVariables>;

interface GetCurrentTravelerStationsRef {
  ...
  (dc: DataConnect, vars: GetCurrentTravelerStationsVariables): QueryRef<GetCurrentTravelerStationsData, GetCurrentTravelerStationsVariables>;
}
export const getCurrentTravelerStationsRef: GetCurrentTravelerStationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentTravelerStationsRef:
```typescript
const name = getCurrentTravelerStationsRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentTravelerStations` query requires an argument of type `GetCurrentTravelerStationsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCurrentTravelerStationsVariables {
  travelerId: UUIDString;
}
```
### Return Type
Recall that executing the `GetCurrentTravelerStations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentTravelerStationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetCurrentTravelerStations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentTravelerStations, GetCurrentTravelerStationsVariables } from '@dataconnect/generated';

// The `GetCurrentTravelerStations` query requires an argument of type `GetCurrentTravelerStationsVariables`:
const getCurrentTravelerStationsVars: GetCurrentTravelerStationsVariables = {
  travelerId: ..., 
};

// Call the `getCurrentTravelerStations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentTravelerStations(getCurrentTravelerStationsVars);
// Variables can be defined inline as well.
const { data } = await getCurrentTravelerStations({ travelerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentTravelerStations(dataConnect, getCurrentTravelerStationsVars);

console.log(data.travelerStations);

// Or, you can use the `Promise` API.
getCurrentTravelerStations(getCurrentTravelerStationsVars).then((response) => {
  const data = response.data;
  console.log(data.travelerStations);
});
```

### Using `GetCurrentTravelerStations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentTravelerStationsRef, GetCurrentTravelerStationsVariables } from '@dataconnect/generated';

// The `GetCurrentTravelerStations` query requires an argument of type `GetCurrentTravelerStationsVariables`:
const getCurrentTravelerStationsVars: GetCurrentTravelerStationsVariables = {
  travelerId: ..., 
};

// Call the `getCurrentTravelerStationsRef()` function to get a reference to the query.
const ref = getCurrentTravelerStationsRef(getCurrentTravelerStationsVars);
// Variables can be defined inline as well.
const ref = getCurrentTravelerStationsRef({ travelerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentTravelerStationsRef(dataConnect, getCurrentTravelerStationsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.travelerStations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.travelerStations);
});
```

## GetTravelerStationsQamProgress
You can execute the `GetTravelerStationsQamProgress` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTravelerStationsQamProgress(vars: GetTravelerStationsQamProgressVariables): QueryPromise<GetTravelerStationsQamProgressData, GetTravelerStationsQamProgressVariables>;

interface GetTravelerStationsQamProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTravelerStationsQamProgressVariables): QueryRef<GetTravelerStationsQamProgressData, GetTravelerStationsQamProgressVariables>;
}
export const getTravelerStationsQamProgressRef: GetTravelerStationsQamProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTravelerStationsQamProgress(dc: DataConnect, vars: GetTravelerStationsQamProgressVariables): QueryPromise<GetTravelerStationsQamProgressData, GetTravelerStationsQamProgressVariables>;

interface GetTravelerStationsQamProgressRef {
  ...
  (dc: DataConnect, vars: GetTravelerStationsQamProgressVariables): QueryRef<GetTravelerStationsQamProgressData, GetTravelerStationsQamProgressVariables>;
}
export const getTravelerStationsQamProgressRef: GetTravelerStationsQamProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTravelerStationsQamProgressRef:
```typescript
const name = getTravelerStationsQamProgressRef.operationName;
console.log(name);
```

### Variables
The `GetTravelerStationsQamProgress` query requires an argument of type `GetTravelerStationsQamProgressVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTravelerStationsQamProgressVariables {
  stationId: UUIDString;
}
```
### Return Type
Recall that executing the `GetTravelerStationsQamProgress` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTravelerStationsQamProgressData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTravelerStationsQamProgressData {
  travelerStations: ({
    id: UUIDString;
    qamInspectionProgress?: number | null;
  } & TravelerStation_Key)[];
}
```
### Using `GetTravelerStationsQamProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTravelerStationsQamProgress, GetTravelerStationsQamProgressVariables } from '@dataconnect/generated';

// The `GetTravelerStationsQamProgress` query requires an argument of type `GetTravelerStationsQamProgressVariables`:
const getTravelerStationsQamProgressVars: GetTravelerStationsQamProgressVariables = {
  stationId: ..., 
};

// Call the `getTravelerStationsQamProgress()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTravelerStationsQamProgress(getTravelerStationsQamProgressVars);
// Variables can be defined inline as well.
const { data } = await getTravelerStationsQamProgress({ stationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTravelerStationsQamProgress(dataConnect, getTravelerStationsQamProgressVars);

console.log(data.travelerStations);

// Or, you can use the `Promise` API.
getTravelerStationsQamProgress(getTravelerStationsQamProgressVars).then((response) => {
  const data = response.data;
  console.log(data.travelerStations);
});
```

### Using `GetTravelerStationsQamProgress`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTravelerStationsQamProgressRef, GetTravelerStationsQamProgressVariables } from '@dataconnect/generated';

// The `GetTravelerStationsQamProgress` query requires an argument of type `GetTravelerStationsQamProgressVariables`:
const getTravelerStationsQamProgressVars: GetTravelerStationsQamProgressVariables = {
  stationId: ..., 
};

// Call the `getTravelerStationsQamProgressRef()` function to get a reference to the query.
const ref = getTravelerStationsQamProgressRef(getTravelerStationsQamProgressVars);
// Variables can be defined inline as well.
const ref = getTravelerStationsQamProgressRef({ stationId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTravelerStationsQamProgressRef(dataConnect, getTravelerStationsQamProgressVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.travelerStations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.travelerStations);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `vos-web` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## AddNote
You can execute the `AddNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addNote(vars: AddNoteVariables): MutationPromise<AddNoteData, AddNoteVariables>;

interface AddNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNoteVariables): MutationRef<AddNoteData, AddNoteVariables>;
}
export const addNoteRef: AddNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addNote(dc: DataConnect, vars: AddNoteVariables): MutationPromise<AddNoteData, AddNoteVariables>;

interface AddNoteRef {
  ...
  (dc: DataConnect, vars: AddNoteVariables): MutationRef<AddNoteData, AddNoteVariables>;
}
export const addNoteRef: AddNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addNoteRef:
```typescript
const name = addNoteRef.operationName;
console.log(name);
```

### Variables
The `AddNote` mutation requires an argument of type `AddNoteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddNoteVariables {
  id: UUIDString;
  inspectionItemId?: UUIDString | null;
  taskId?: UUIDString | null;
  travelerId?: UUIDString | null;
  text: string;
  type?: NoteType | null;
}
```
### Return Type
Recall that executing the `AddNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddNoteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddNoteData {
  note_insert: Note_Key;
}
```
### Using `AddNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addNote, AddNoteVariables } from '@dataconnect/generated';

// The `AddNote` mutation requires an argument of type `AddNoteVariables`:
const addNoteVars: AddNoteVariables = {
  id: ..., 
  inspectionItemId: ..., // optional
  taskId: ..., // optional
  travelerId: ..., // optional
  text: ..., 
  type: ..., // optional
};

// Call the `addNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addNote(addNoteVars);
// Variables can be defined inline as well.
const { data } = await addNote({ id: ..., inspectionItemId: ..., taskId: ..., travelerId: ..., text: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addNote(dataConnect, addNoteVars);

console.log(data.note_insert);

// Or, you can use the `Promise` API.
addNote(addNoteVars).then((response) => {
  const data = response.data;
  console.log(data.note_insert);
});
```

### Using `AddNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addNoteRef, AddNoteVariables } from '@dataconnect/generated';

// The `AddNote` mutation requires an argument of type `AddNoteVariables`:
const addNoteVars: AddNoteVariables = {
  id: ..., 
  inspectionItemId: ..., // optional
  taskId: ..., // optional
  travelerId: ..., // optional
  text: ..., 
  type: ..., // optional
};

// Call the `addNoteRef()` function to get a reference to the mutation.
const ref = addNoteRef(addNoteVars);
// Variables can be defined inline as well.
const ref = addNoteRef({ id: ..., inspectionItemId: ..., taskId: ..., travelerId: ..., text: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addNoteRef(dataConnect, addNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.note_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.note_insert);
});
```

## CreateTravelerTemplate
You can execute the `CreateTravelerTemplate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTravelerTemplate(vars: CreateTravelerTemplateVariables): MutationPromise<CreateTravelerTemplateData, CreateTravelerTemplateVariables>;

interface CreateTravelerTemplateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTravelerTemplateVariables): MutationRef<CreateTravelerTemplateData, CreateTravelerTemplateVariables>;
}
export const createTravelerTemplateRef: CreateTravelerTemplateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTravelerTemplate(dc: DataConnect, vars: CreateTravelerTemplateVariables): MutationPromise<CreateTravelerTemplateData, CreateTravelerTemplateVariables>;

interface CreateTravelerTemplateRef {
  ...
  (dc: DataConnect, vars: CreateTravelerTemplateVariables): MutationRef<CreateTravelerTemplateData, CreateTravelerTemplateVariables>;
}
export const createTravelerTemplateRef: CreateTravelerTemplateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTravelerTemplateRef:
```typescript
const name = createTravelerTemplateRef.operationName;
console.log(name);
```

### Variables
The `CreateTravelerTemplate` mutation requires an argument of type `CreateTravelerTemplateVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTravelerTemplateVariables {
  id: UUIDString;
  name?: string | null;
}
```
### Return Type
Recall that executing the `CreateTravelerTemplate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTravelerTemplateData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTravelerTemplateData {
  travelerTemplate_insert: TravelerTemplate_Key;
}
```
### Using `CreateTravelerTemplate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTravelerTemplate, CreateTravelerTemplateVariables } from '@dataconnect/generated';

// The `CreateTravelerTemplate` mutation requires an argument of type `CreateTravelerTemplateVariables`:
const createTravelerTemplateVars: CreateTravelerTemplateVariables = {
  id: ..., 
  name: ..., // optional
};

// Call the `createTravelerTemplate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTravelerTemplate(createTravelerTemplateVars);
// Variables can be defined inline as well.
const { data } = await createTravelerTemplate({ id: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTravelerTemplate(dataConnect, createTravelerTemplateVars);

console.log(data.travelerTemplate_insert);

// Or, you can use the `Promise` API.
createTravelerTemplate(createTravelerTemplateVars).then((response) => {
  const data = response.data;
  console.log(data.travelerTemplate_insert);
});
```

### Using `CreateTravelerTemplate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTravelerTemplateRef, CreateTravelerTemplateVariables } from '@dataconnect/generated';

// The `CreateTravelerTemplate` mutation requires an argument of type `CreateTravelerTemplateVariables`:
const createTravelerTemplateVars: CreateTravelerTemplateVariables = {
  id: ..., 
  name: ..., // optional
};

// Call the `createTravelerTemplateRef()` function to get a reference to the mutation.
const ref = createTravelerTemplateRef(createTravelerTemplateVars);
// Variables can be defined inline as well.
const ref = createTravelerTemplateRef({ id: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTravelerTemplateRef(dataConnect, createTravelerTemplateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.travelerTemplate_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.travelerTemplate_insert);
});
```

## CreateStation
You can execute the `CreateStation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createStation(vars: CreateStationVariables): MutationPromise<CreateStationData, CreateStationVariables>;

interface CreateStationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStationVariables): MutationRef<CreateStationData, CreateStationVariables>;
}
export const createStationRef: CreateStationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStation(dc: DataConnect, vars: CreateStationVariables): MutationPromise<CreateStationData, CreateStationVariables>;

interface CreateStationRef {
  ...
  (dc: DataConnect, vars: CreateStationVariables): MutationRef<CreateStationData, CreateStationVariables>;
}
export const createStationRef: CreateStationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStationRef:
```typescript
const name = createStationRef.operationName;
console.log(name);
```

### Variables
The `CreateStation` mutation requires an argument of type `CreateStationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateStationVariables {
  id: UUIDString;
  taskTemplateId?: UUIDString | null;
  name?: string | null;
  order?: number | null;
  doesReceiveTravelers?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateStation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStationData {
  station_insert: Station_Key;
}
```
### Using `CreateStation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStation, CreateStationVariables } from '@dataconnect/generated';

// The `CreateStation` mutation requires an argument of type `CreateStationVariables`:
const createStationVars: CreateStationVariables = {
  id: ..., 
  taskTemplateId: ..., // optional
  name: ..., // optional
  order: ..., // optional
  doesReceiveTravelers: ..., // optional
};

// Call the `createStation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStation(createStationVars);
// Variables can be defined inline as well.
const { data } = await createStation({ id: ..., taskTemplateId: ..., name: ..., order: ..., doesReceiveTravelers: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStation(dataConnect, createStationVars);

console.log(data.station_insert);

// Or, you can use the `Promise` API.
createStation(createStationVars).then((response) => {
  const data = response.data;
  console.log(data.station_insert);
});
```

### Using `CreateStation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStationRef, CreateStationVariables } from '@dataconnect/generated';

// The `CreateStation` mutation requires an argument of type `CreateStationVariables`:
const createStationVars: CreateStationVariables = {
  id: ..., 
  taskTemplateId: ..., // optional
  name: ..., // optional
  order: ..., // optional
  doesReceiveTravelers: ..., // optional
};

// Call the `createStationRef()` function to get a reference to the mutation.
const ref = createStationRef(createStationVars);
// Variables can be defined inline as well.
const ref = createStationRef({ id: ..., taskTemplateId: ..., name: ..., order: ..., doesReceiveTravelers: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStationRef(dataConnect, createStationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.station_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.station_insert);
});
```

## TravelerStation
You can execute the `TravelerStation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
travelerStation(vars: TravelerStationVariables): MutationPromise<TravelerStationData, TravelerStationVariables>;

interface TravelerStationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: TravelerStationVariables): MutationRef<TravelerStationData, TravelerStationVariables>;
}
export const travelerStationRef: TravelerStationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
travelerStation(dc: DataConnect, vars: TravelerStationVariables): MutationPromise<TravelerStationData, TravelerStationVariables>;

interface TravelerStationRef {
  ...
  (dc: DataConnect, vars: TravelerStationVariables): MutationRef<TravelerStationData, TravelerStationVariables>;
}
export const travelerStationRef: TravelerStationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the travelerStationRef:
```typescript
const name = travelerStationRef.operationName;
console.log(name);
```

### Variables
The `TravelerStation` mutation requires an argument of type `TravelerStationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface TravelerStationVariables {
  id: UUIDString;
  stationId: UUIDString;
  travelerId: UUIDString;
  isCurrent?: boolean | null;
  leadInspectionProgress?: number | null;
  qamInspectionProgress?: number | null;
  taskProgress?: number | null;
}
```
### Return Type
Recall that executing the `TravelerStation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `TravelerStationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface TravelerStationData {
  travelerStation_insert: TravelerStation_Key;
}
```
### Using `TravelerStation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, travelerStation, TravelerStationVariables } from '@dataconnect/generated';

// The `TravelerStation` mutation requires an argument of type `TravelerStationVariables`:
const travelerStationVars: TravelerStationVariables = {
  id: ..., 
  stationId: ..., 
  travelerId: ..., 
  isCurrent: ..., // optional
  leadInspectionProgress: ..., // optional
  qamInspectionProgress: ..., // optional
  taskProgress: ..., // optional
};

// Call the `travelerStation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await travelerStation(travelerStationVars);
// Variables can be defined inline as well.
const { data } = await travelerStation({ id: ..., stationId: ..., travelerId: ..., isCurrent: ..., leadInspectionProgress: ..., qamInspectionProgress: ..., taskProgress: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await travelerStation(dataConnect, travelerStationVars);

console.log(data.travelerStation_insert);

// Or, you can use the `Promise` API.
travelerStation(travelerStationVars).then((response) => {
  const data = response.data;
  console.log(data.travelerStation_insert);
});
```

### Using `TravelerStation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, travelerStationRef, TravelerStationVariables } from '@dataconnect/generated';

// The `TravelerStation` mutation requires an argument of type `TravelerStationVariables`:
const travelerStationVars: TravelerStationVariables = {
  id: ..., 
  stationId: ..., 
  travelerId: ..., 
  isCurrent: ..., // optional
  leadInspectionProgress: ..., // optional
  qamInspectionProgress: ..., // optional
  taskProgress: ..., // optional
};

// Call the `travelerStationRef()` function to get a reference to the mutation.
const ref = travelerStationRef(travelerStationVars);
// Variables can be defined inline as well.
const ref = travelerStationRef({ id: ..., stationId: ..., travelerId: ..., isCurrent: ..., leadInspectionProgress: ..., qamInspectionProgress: ..., taskProgress: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = travelerStationRef(dataConnect, travelerStationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.travelerStation_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.travelerStation_insert);
});
```

## traveler
You can execute the `traveler` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
traveler(vars: TravelerVariables): MutationPromise<TravelerData, TravelerVariables>;

interface TravelerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: TravelerVariables): MutationRef<TravelerData, TravelerVariables>;
}
export const travelerRef: TravelerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
traveler(dc: DataConnect, vars: TravelerVariables): MutationPromise<TravelerData, TravelerVariables>;

interface TravelerRef {
  ...
  (dc: DataConnect, vars: TravelerVariables): MutationRef<TravelerData, TravelerVariables>;
}
export const travelerRef: TravelerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the travelerRef:
```typescript
const name = travelerRef.operationName;
console.log(name);
```

### Variables
The `traveler` mutation requires an argument of type `TravelerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface TravelerVariables {
  id: UUIDString;
  moduleProfileId?: string | null;
  travelerTemplateId: UUIDString;
  isShipped?: boolean | null;
  notesRequiredUpload?: boolean | null;
  serialNumber?: string | null;
}
```
### Return Type
Recall that executing the `traveler` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `TravelerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface TravelerData {
  traveler_insert: Traveler_Key;
}
```
### Using `traveler`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, traveler, TravelerVariables } from '@dataconnect/generated';

// The `traveler` mutation requires an argument of type `TravelerVariables`:
const travelerVars: TravelerVariables = {
  id: ..., 
  moduleProfileId: ..., // optional
  travelerTemplateId: ..., 
  isShipped: ..., // optional
  notesRequiredUpload: ..., // optional
  serialNumber: ..., // optional
};

// Call the `traveler()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await traveler(travelerVars);
// Variables can be defined inline as well.
const { data } = await traveler({ id: ..., moduleProfileId: ..., travelerTemplateId: ..., isShipped: ..., notesRequiredUpload: ..., serialNumber: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await traveler(dataConnect, travelerVars);

console.log(data.traveler_insert);

// Or, you can use the `Promise` API.
traveler(travelerVars).then((response) => {
  const data = response.data;
  console.log(data.traveler_insert);
});
```

### Using `traveler`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, travelerRef, TravelerVariables } from '@dataconnect/generated';

// The `traveler` mutation requires an argument of type `TravelerVariables`:
const travelerVars: TravelerVariables = {
  id: ..., 
  moduleProfileId: ..., // optional
  travelerTemplateId: ..., 
  isShipped: ..., // optional
  notesRequiredUpload: ..., // optional
  serialNumber: ..., // optional
};

// Call the `travelerRef()` function to get a reference to the mutation.
const ref = travelerRef(travelerVars);
// Variables can be defined inline as well.
const ref = travelerRef({ id: ..., moduleProfileId: ..., travelerTemplateId: ..., isShipped: ..., notesRequiredUpload: ..., serialNumber: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = travelerRef(dataConnect, travelerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.traveler_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.traveler_insert);
});
```

