type ProcedureType = 'login' | 'signup'

interface UserDataType {
  file: File | null
  chattaName: string
  firstName: string
  lastName: string
  email: string
  password: string
}

// 名前のバリデーションパターン：全角ひらがな、全角漢字、全角カタカナ、全角英語、半角英語
// todo バリデーションチェックのパターン修正を行う
const nameValidPattern =
  /^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/

export const validationCheck = (
  procedure: ProcedureType,
  userData: UserDataType
) => {
  // サインアップ時、プロフィール画像が未設定の場合
  if (procedure === 'signup' && !userData.file) {
    return {
      errorCode: 'fileError',
      errorMessage: 'Set your profile picture.'
    }
  }

  // サインアップ時、チャッタネームが未入力の場合
  if (procedure === 'signup' && !userData.chattaName) {
    return {
      errorCode: 'chattaNameError',
      errorMessage: 'Please enter your chatta name.'
    }
  }

  // サインアップ時、名が未入力の場合
  if (procedure === 'signup' && !userData.firstName) {
    return {
      errorCode: 'firstNameError',
      errorMessage: 'Please enter your first name.'
    }
  }

  // サインアップ時、姓が未入力の場合
  if (procedure === 'signup' && !userData.lastName) {
    return {
      errorCode: 'lastNameError',
      errorMessage: 'Please enter your last name.'
    }
  }

  // サインアップ時、チャッタネームに名前のバリデーションパターン以外の文字が入力されている場合
  if (
    procedure === 'signup' &&
    !nameValidPattern.test(userData.chattaName.trim())
  ) {
    return {
      errorCode: 'chattaNameError',
      errorMessage: 'Contains invalid characters.'
    }
  }

  // サインアップ時、名に名前のバリデーションパターン以外の文字が入力されている場合
  if (
    procedure === 'signup' &&
    !nameValidPattern.test(userData.firstName.trim())
  ) {
    return {
      errorCode: 'firstNameError',
      errorMessage: 'Contains invalid characters.'
    }
  }

  // サインアップ時、姓に名前のバリデーションパターン以外の文字が入力されている場合
  if (
    procedure === 'signup' &&
    !nameValidPattern.test(userData.lastName.trim())
  ) {
    return {
      errorCode: 'lastNameError',
      errorMessage: 'Contains invalid characters.'
    }
  }

  // サインアップまたはログイン時、メールアドレスが未入力の場合
  if ((procedure === 'signup' || procedure === 'login') && !userData.email) {
    return {
      errorCode: 'emailError',
      errorMessage: 'Please enter your email address'
    }
  }

  // サインアップまたはログイン時、メールアドレスの形式が間違っている場合
  const emailValidPattern =
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
  if (
    (procedure === 'signup' || procedure === 'login') &&
    !emailValidPattern.test(userData.email)
  ) {
    return {
      errorCode: 'emailError',
      errorMessage: 'Email address is in the wrong format.'
    }
  }

  // サインアップまたはログイン時、パスワードが未入力の場合
  if ((procedure === 'signup' || procedure === 'login') && !userData.password) {
    return {
      errorCode: 'passwordError',
      errorMessage: 'Please enter your password'
    }
  }

  // サインアップ時、パスワードが6桁以上20桁以下の半角英数字で、「.」以外の記号が入力されている場合
  // サインアップ時、先頭、末尾に「.」が入力されている場合
  const passwordValidPattern = /^(?!\.)[A-Za-z0-9.]{6,20}(?<!\.)$/
  if (procedure === 'signup' && !passwordValidPattern.test(userData.password)) {
    return {
      errorCode: 'passwordError',
      errorMessage: `The password must be at least 6 and no more than 20 single-byte alphanumeric characters.
      The symbol "." but not at the beginning or end.`
    }
  }

  // ログイン時、パスワードに誤りがある場合
  if (procedure === 'login' && !passwordValidPattern.test(userData.password)) {
    return {
      errorCode: 'passwordError',
      errorMessage: 'There is an error in your password.'
    }
  }

  return {
    errorCode: '',
    errorMessage: ''
  }
}
