import React, { useCallback, useEffect, useMemo } from 'react'
import { Spin, Empty } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import type { NextPageWithLayout } from '@/pages/_app'
import type { IProps as SideBarProps } from '@/components/docs/side-bar'
import useOperationStore from '@/stores/operation'
import SideBar from '@/components/docs/side-bar'
import Content from '@/components/docs/content'
import config from '@/config'
import { NavbarLayout } from '@/components/common/layouts'

/** doc page */
const Doc: NextPageWithLayout = () => {
  const {
    mounted,
    operations,
    error,
    keyword,
    selectedOperation,
    updateState,
  } = useOperationStore()

  useEffect(() => {
    if (!mounted || error) {
      updateState({ mounted: true })
      fetch(`${config.host}/graphql/operations`)
        .then(res => res.json())
        .then(resp => {
          const _operations = resp.data
          updateState({
            operations: _operations,
            mounted: true,
            error: null,
            selectedOperation: _operations[0],
          })
        })
        .catch(err => {
          updateState({ error: err, operations: [] })
        })
    }
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

  const content = useMemo(() => {
    if (!mounted || !operations) {
      return (
        <div className={styles.placeholderWrapper}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: '36px' }} />} />
        </div>
      )
    }
    if (error) {
      return (
        <div className={styles.placeholderWrapper}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="It seems that there is no operations in your schema"
          />
        </div>
      )
    }

    const selectedOperationId =
      (selectedOperation?.type || '') + selectedOperation?.name

    return (
      <>
        <SideBar
          keyword={keyword || ''}
          onKeywordChange={onKeywordChange}
          operations={operations}
          selectedOperationId={selectedOperationId}
          onSelect={onSelect}
        />
        <Content key={selectedOperationId} operation={selectedOperation} />
      </>
    )
  }, [mounted, operations, error, selectedOperation, keyword, onKeywordChange])

  return <div className={styles.main}>{content}</div>
}

Doc.getLayout = (page: React.ReactElement) => {
  return <NavbarLayout>{page}</NavbarLayout>
}

export default Doc
