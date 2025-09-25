import * as admin from "firebase-admin";
import { ENV } from "../config/envConfig";

// Initialize Firebase Admin SDK with environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(ENV.FIREBASE as admin.ServiceAccount),
    projectId: ENV.FIREBASE.project_id
  });
}

export const auth = admin.auth();
export const firestore = admin.firestore();

export const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};


export const getUserByUid = async (uid: string) => {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    throw new Error('User not found');
  }
};
