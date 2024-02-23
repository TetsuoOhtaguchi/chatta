import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp(functions.config().firebase)

// 環境変数を設定
process.env.TZ = 'Asia/Tokyo' // *new Date()は変わらないが、new Date().getMinutes()などの場合に日本時間で取得できる
