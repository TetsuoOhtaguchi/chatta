/** @jsxImportSource @emotion/react */
import React from "react"
import { css } from "@emotion/react"

const title = css`
  color: green;
`

const Products: React.FC = () => {
  return <div css={title}>This is the Products componentt!</div>
}

export default Products