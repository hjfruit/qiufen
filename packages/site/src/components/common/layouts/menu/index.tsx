import React, { useState } from 'react'
import { Menu } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import type { FC } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

const MenuLayout: FC<IProps> = () => {
  const router = useRouter()
  const [activeKey, setActiveKey] = useState(['home'])

  return (
    <Menu
      style={{
        position: 'fixed',
        height: '100%',
        left: 0,
      }}
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
  )
}

export default MenuLayout
