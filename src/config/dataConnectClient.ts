import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDataConnect } from "firebase-admin/data-connect";
import serviceAccount from "../../vederra-7c271-firebase-adminsdk-fbsvc-759bcea130.json";

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const dataConnect = getDataConnect({
  serviceId: process.env.DATA_CONNECT_SERVICE_ID!,
  location: process.env.DATA_CONNECT_LOCATION!,
});
