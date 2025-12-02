/**
 * Chat Connector Configuration
 * Configures the Firebase Data Connect client for chat operations
 * Connects to emulator in development, production in prod
 */

import { initializeApp, getApps } from 'firebase/app';
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '../dataconnect-generated/chat';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase client app (only once)
if (getApps().length === 0) {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    apiKey: process.env.FIREBASE_WEB_API_KEY || 'dummy-key-for-emulator',
  });
}

// Get Data Connect instance for chat connector
const chatDataConnect = getDataConnect(connectorConfig);

// Connect to emulator if running locally
const useEmulator = process.env.USE_DATACONNECT_EMULATOR !== 'false'; // Default to true

if (useEmulator) {
  console.log('🔧 [Chat] Connecting to Data Connect Emulator at localhost:9399');
  connectDataConnectEmulator(chatDataConnect, 'localhost', 9399);
} else {
  console.log('🌐 [Chat] Connecting to Production Data Connect');
}

export { chatDataConnect };
