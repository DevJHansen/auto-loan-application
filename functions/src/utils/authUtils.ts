import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const isUserAuthorized = async (
  request: functions.https.Request,
  response: functions.Response
): Promise<boolean> => {
  const { headers } = request;

  const token = headers.authorization?.split('Bearer ')[1];

  if (!token) {
    response.status(403).send('Unauthorized');
    return false;
  }

  const user = await admin.auth().verifyIdToken(token);

  if (!user.email) {
    response.status(403).send('Unauthorized');
    return false;
  }

  return true;
};
