import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDataConnect } from "firebase-admin/data-connect";
import serviceAccount from "../../vederra-7c271-firebase-adminsdk-fbsvc-759bcea130.json";

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
    projectId: "vederra-7c271",
  });
}

export const dataConnect = getDataConnect({
  serviceId: "vos-web-1",
  location: "us-central1",
});
