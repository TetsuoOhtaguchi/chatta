import React, { ReactNode } from 'react'

type ProviderComponent = React.FC<{ children: ReactNode }>

/**
 * ContextProviderを再帰的にまとめる関数
 * @param providers ContextProviderの配列
 * @returns ContextProviderを再帰的にまとめたコンポーネント
 */
const buildProvidersTree = (
  providers: ProviderComponent[]
): ProviderComponent => {
  if (providers.length === 1) {
    return providers[0]
  }

  const FirstProvider = providers.shift()
  const SecondProvider = providers.shift()

  if (FirstProvider === undefined || SecondProvider === undefined) {
    throw new Error('ContextProviderが不足しています')
  }

  return buildProvidersTree([
    ({ children }) => (
      <FirstProvider>
        <SecondProvider>{children}</SecondProvider>
      </FirstProvider>
    ),
    ...providers
  ])
}

export default buildProvidersTree
