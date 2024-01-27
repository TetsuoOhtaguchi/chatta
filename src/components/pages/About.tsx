/** @jsxImportSource @emotion/react */
import React from "react"
import { css } from "@emotion/react"

const title = css`
  color: blue;
`

const About: React.FC = () => {
  return <div css={title}>This is the About componentt!</div>
}

export default About