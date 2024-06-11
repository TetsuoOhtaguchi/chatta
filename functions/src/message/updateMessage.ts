import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const updateMessage = functions
  .region('asia-northeast1')
  .https.onCall(async data => {
    try {
      // メッセージコレクションのメッセージを更新する
      if (!data) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Data is missing. Please provide valid data.'
        )
      }

      const messageRef = admin
        .firestore()
        .collection('chatrooms')
        .doc(data.key)
        .collection('messages')
        .doc(data.docId)

      await messageRef.update({
        alreadyRead: data.alreadyRead
      })

      return { success: true }
    } catch (error) {
      console.error('Error adding document: ', error)
      throw new functions.https.HttpsError(
        'internal',
        'An error occurred while saving the message'
      )
    }
  })
