// import { signInWithEmailAndPassword, User, UserCredential } from "firebase/auth"
// import { auth } from "./firebase"
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

const title = css`
  color: red;
`

const App = () => {
  // signInWithEmailAndPassword(auth, "example@gmail.com", "exampleuser").then(
  //   (credential: UserCredential) => {
  //     const user: User = credential.user
  //     if (user) {
  //       console.log("Login: Success!!")
  //     }
  //   }
  // )
  return <div css={title}>App</div>
}

export default App