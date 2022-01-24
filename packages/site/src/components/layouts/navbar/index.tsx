import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './index.module.less'
import type { NextPage } from 'next'
import logo from '@/assets/logo.svg'

const NavbarLayout: NextPage = ({ children }) => {
  return (
    <div>
      <div className={styles.header}>
        <Image className={styles.logo} width={32} height={32} src={logo} />
        <div className={styles.appName}>graphql-kit</div>
        <nav className={styles.nav}>
          <Link href="/doc">文档</Link>
        </nav>
      </div>
      {children}
    </div>
  )
}

export default NavbarLayout
