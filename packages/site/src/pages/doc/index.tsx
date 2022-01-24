import React, { useCallback, useEffect } from 'react'
import styles from './index.module.less'
import type { NextPageWithLayout } from '@/pages/_app'
import type { IProps as SideBarProps } from '@/components/doc/side-bar'
import useOperationStore from '@/stores/operation'
import SideBar from '@/components/doc/side-bar'
import Content from '@/components/doc/content'
import { NavbarLayout } from '@/components/layouts'

const Doc: NextPageWithLayout = () => {
  const { ready, operations, error, keyword, selectedOperation, updateState } =
    useOperationStore()

  useEffect(() => {
    fetch('http://192.168.10.25:9406/graphql/operations')
      .then(res => res.json())
      .then(resp => {
        updateState({ operations: resp.data, ready: true, error: null })
      })
  }, [])

  const onSelect: SideBarProps['onSelect'] = useCallback(
    operation => {
      updateState({
        selectedOperation: operation,
      })
    },
    [updateState],
  )
  const onKeywordChange: SideBarProps['onKeywordChange'] = useCallback(
    keyword => {
      updateState({
        keyword,
      })
    },
    [updateState],
  )
  if (!ready) {
    return <div>loading</div>
  }

  if (error || !operations) {
    return <div>error</div>
  }

  return (
    <div className={styles.main}>
      <SideBar
        keyword={keyword || ''}
        onKeywordChange={onKeywordChange}
        operations={operations}
        selectedOperationId={
          selectedOperation?.type || '' + selectedOperation?.name || ''
        }
        onSelect={onSelect}
      />
      <Content operation={selectedOperation} />
    </div>
  )
}

Doc.getLayout = (page: React.ReactElement) => {
  return <NavbarLayout>{page}</NavbarLayout>
}

export default Doc
