import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const addMessage = functions
  .region('asia-northeast1')
  .https.onCall(async data => {
    try {
      // chatroomsコレクションへメッセージを保存する
      if (!data.message) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Message not specified'
        )
      }

      const messageDocRef = admin
        .firestore()
        .collection('chatrooms')
        .doc(data.key)
        .collection('messages')
        .doc()

      await messageDocRef.set({
        id: messageDocRef.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        message: data.message,
        sendUid: data.sendUid,
        alreadyRead: false
      })

      return messageDocRef.id
    } catch (error) {
      console.error('Error adding document: ', error)
      throw new functions.https.HttpsError(
        'internal',
        'An error occurred while saving the message'
      )
    }
  })
