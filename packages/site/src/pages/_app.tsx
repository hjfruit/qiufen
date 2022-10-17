import React from 'react'
import '@/styles/globals.less'

import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import MenuLayout from '@/components/common/layouts/menu'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page)

  return getLayout(
    <div style={{ display: 'flex' }}>
      <MenuLayout />
      <div style={{ flex: 1, marginLeft: 62 }}>
        <Component {...pageProps} />
      </div>
    </div>,
  )
}

export default MyApp
