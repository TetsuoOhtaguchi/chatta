import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const createUser = functions
  .region('asia-northeast1')
  .https.onCall(async data => {
    try {
      const userAuth = await admin.auth().createUser({
        email: data.email,
        password: data.password
      })
      if (!userAuth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'User not authenticated'
        )
      }

      const uid = userAuth.uid

      // Firestoreへユーザー情報を登録する
      const userDocRef = admin.firestore().doc(`users/${uid}`)

      await userDocRef.set({
        id: uid,
        email: data.email,
        name: data.name,
        src: '',
        friends: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })

      return uid
    } catch (error) {
      console.log(error)
      throw new functions.https.HttpsError(
        'internal',
        'An error occurred while creating the user.'
      )
    }
  })
