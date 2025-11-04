// src/config/firebaseDataConnect.ts

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getDataConnect } from 'firebase-admin/data-connect';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.FIREBASE_PROJECT_ID) throw new Error('Missing FIREBASE_PROJECT_ID');
if (!process.env.FIREBASE_CLIENT_EMAIL) throw new Error('Missing FIREBASE_CLIENT_EMAIL');
if (!process.env.FIREBASE_PRIVATE_KEY) throw new Error('Missing FIREBASE_PRIVATE_KEY');
if (!process.env.DATA_CONNECT_CONNECTION_ID) throw new Error('Missing DATA_CONNECT_CONNECTION_ID');
if (!process.env.DATA_CONNECT_LOCATION) throw new Error('Missing DATA_CONNECT_LOCATION');

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.projectId,
});

export const dataConnect = getDataConnect({
  serviceId: process.env.DATA_CONNECT_CONNECTION_ID,
  location: process.env.DATA_CONNECT_LOCATION,
});
