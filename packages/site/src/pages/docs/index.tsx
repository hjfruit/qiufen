import React, { useCallback } from 'react'
import { Spin, Empty } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useMount } from '@fruits-chain/hooks-laba'
import { useRouter } from 'next/router'
import styles from './index.module.less'
import type { NextPageWithLayout } from '@/pages/_app'
import type { IProps as SideBarProps } from '@/components/docs/side-bar'
import useOperationStore, { NetworkStatus } from '@/stores/operation'
import SideBar from '@/components/docs/side-bar'
import Content from '@/components/docs/content'
import config from '@/config'
import { NavbarLayout } from '@/components/common/layouts'

/** doc page */
const Doc: NextPageWithLayout = () => {
  // retrieve page data from store
  const { networkStatus, operations, error, keyword, updateState } =
    useOperationStore()
  const router = useRouter()
  const pageQuery = router.query as {
    operationType?: string
    operationName?: string
  }

  // fetch page data
  useMount(() => {
    if ([NetworkStatus.INITIAL, NetworkStatus.FAILED].includes(networkStatus)) {
      updateState({ networkStatus: NetworkStatus.PENDING })
      fetch(`${config.host}/graphql/operations`)
        .then(res => res.json())
        .then(resp => {
          updateState({
            networkStatus: NetworkStatus.SUCCESSFUL,
            operations: resp.data,
            error: null,
          })
        })
        .catch(err => {
          updateState({
            networkStatus: NetworkStatus.FAILED,
            operations: [],
            error: err,
          })
        })
    }
  })

  // handle operation selection event
  const onSelect: SideBarProps['onSelect'] = useCallback(
    operation => {
      router.push(
        `/docs?operationType=${operation.operationType}&operationName=${operation.name}`,
      )
    },
    [updateState],
  )

  // handle keyword change event
  const onKeywordChange: SideBarProps['onKeywordChange'] = useCallback(
    keyword => {
      updateState({
        keyword,
      })
    },
    [updateState],
  )

  // loading content
  let content: React.ReactNode = null
  if ([NetworkStatus.INITIAL, NetworkStatus.PENDING].includes(networkStatus)) {
    content = (
      <div className={styles.placeholderWrapper}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: '36px' }} />} />
      </div>
    )
  } else if (
    networkStatus === NetworkStatus.FAILED ||
    operations.length === 0
  ) {
    // error content
    content = (
      <div className={styles.placeholderWrapper}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            error?.message ||
            'It seems that there is no operations in your schema'
          }
        />
      </div>
    )
  } else {
    // normal content
    const { operationType = '', operationName = '' } = pageQuery
    let selectedOperationId = operationType + operationName
    const selectedOperation =
      operations.find(
        operation =>
          operation.operationType + operation.name === selectedOperationId,
      ) ||
      // if no operation could be found by selectedOperationId, set operations[0] as default
      (() => {
        selectedOperationId = operations[0].operationType + operations[0].name
        return operations[0]
      })()
    content = (
      <>
        <SideBar
          keyword={keyword}
          onKeywordChange={onKeywordChange}
          operations={operations}
          selectedOperationId={selectedOperationId}
          onSelect={onSelect}
        />
        <Content key={selectedOperationId} operation={selectedOperation} />
      </>
    )
  }

  return <div className={styles.main}>{content}</div>
}

Doc.getLayout = (page: React.ReactElement) => {
  return <NavbarLayout>{page}</NavbarLayout>
}

export default Doc
