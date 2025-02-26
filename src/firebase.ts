import { FirebaseApp, initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'
import { Functions, getFunctions } from 'firebase/functions'
import { FirebaseStorage, getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
}

const app: FirebaseApp = initializeApp(firebaseConfig)
export const auth: Auth = getAuth()
export const db: Firestore = getFirestore(app)
export const functions: Functions = getFunctions(app, 'asia-northeast1')
export const storage: FirebaseStorage = getStorage(app)
