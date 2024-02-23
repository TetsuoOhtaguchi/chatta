/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const title = css`
  font-size: 36px;
  font-weight: 600;
`

const FriendsPage: React.FC = () => {
  return (
    <>
      <h2 css={title}>Friends</h2>
    </>
  )
}

export default FriendsPage
