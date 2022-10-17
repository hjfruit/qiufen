import '@/styles/globals.less'
import { HomeOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page)
  const router = useRouter()
  const [activeKey, setActiveKey] = useState(['home'])

  return getLayout(
    <div style={{ display: 'flex' }}>
      <Menu
        defaultSelectedKeys={activeKey}
        onClick={({ key }) => {
          setActiveKey([key])
        }}>
        <Menu.Item
          onClick={() => {
            router.push('/docs')
          }}
          key="home"
          icon={<HomeOutlined />}
        />
      </Menu>
      <div style={{ flex: 1 }}>
        <Component {...pageProps} />
      </div>
    </div>,
  )
}

export default MyApp
