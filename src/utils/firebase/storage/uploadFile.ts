import { ref } from 'firebase/storage'
import { uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { FirebaseStorage, TaskState } from 'firebase/storage'

/**
 * Firestorageにファイルをアップロードする関数
 * @param storage
 * @param path
 * @param file
 * @param fun
 */
export const uploadFile = async (
  storage: FirebaseStorage,
  path: string,
  file: File,
  fun?: (progress: number, status: TaskState) => string
): Promise<string> => {
  const storageRef = ref(storage, path)

  const uploadTask = Array.isArray(file)
    ? uploadBytesResumable(storageRef, file[0], file[1])
    : uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress: number =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100

        if (fun) {
          fun(progress, snapshot.state)
        }
      },
      error => {
        reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          resolve(downloadURL)
        })
      }
    )
  })
}
