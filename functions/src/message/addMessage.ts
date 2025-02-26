import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const addMessage = functions
  .region('asia-northeast1')
  .https.onCall(async data => {
    try {
      // messagesコレクションへ情報を追加する
      if (!data) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Message not specified'
        )
      }

      const messagesDocRef = admin.firestore().collection('messages').doc()

      await messagesDocRef.set({
        id: messagesDocRef.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        message: data.message,
        sendUid: data.sendUid
      })

      return messagesDocRef.id
    } catch (error) {
      console.error('Error adding document: ', error)
      throw new functions.https.HttpsError(
        'internal',
        'An error occurred while saving the message'
      )
    }
  })
