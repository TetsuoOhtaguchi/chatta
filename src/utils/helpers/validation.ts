type Field = 'file' | 'name' | 'email' | 'password'

/**
 * 入力チェック
 * @param val
 * @param file
 * @param field
 */
export const validationCheck = (
  val: string,
  file: File | null,
  field: Field
) => {
  // プロフィール画像の入力チェックを行う
  if (field === 'file' && !file) {
    return true
  }
  if (field === 'file' && file) {
    return false
  }

  // 名前の入力チェックを行う
  if (field === 'name' && !val) {
    return true
  }
  if (field === 'name' && val) {
    return false
  }

  // メールの入力チェックを行う
  if (
    field === 'email' &&
    (!val ||
      !/^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(
        val
      ))
  ) {
    return true
  }
  if (
    field === 'email' &&
    val &&
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(
      val
    )
  ) {
    return false
  }

  // パスワードの入力チェックを行う
  if (
    field === 'password' &&
    !/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,20}$/.test(val)
  ) {
    return true
  }
  if (
    field === 'password' &&
    /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,20}$/.test(val)
  ) {
    return false
  }

  return false
}
