import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const uploadUser = functions
  .region('asia-northeast1')
  .https.onCall(async data => {
    try {
      // ユーザー情報を更新する
      if (!data.id) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'User not authenticated'
        )
      }

      const userRef = admin.firestore().collection('users').doc(data.id)
      await userRef.update(data)

      return { success: true }
    } catch (error) {
      console.log(error)
      throw new functions.https.HttpsError(
        'internal',
        'occurred while updating the user.'
      )
    }
  })
