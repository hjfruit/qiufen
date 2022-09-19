import React from 'react'
import Image from 'next/image'
import styles from './index.module.less'
import type { NextPage } from 'next'
import logo from '@/assets/logo.svg'

const NavbarLayout: NextPage = ({ children }) => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Image className={styles.logo} width={32} height={32} src={logo} />
        <div className={styles.appName}>qiufen</div>
        <nav className={styles.nav}>
          <a className={styles.active}>Docs</a>
        </nav>
      </div>
      {children}
    </div>
  )
}

export default NavbarLayout
