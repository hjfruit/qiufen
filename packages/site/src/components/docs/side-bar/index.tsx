import React, { memo, useMemo, useState } from 'react'
import { Input, Collapse, Tooltip, Space } from 'antd'
import {
  UpCircleOutlined,
  MinusCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import { useThrottleFn } from '@fruits-chain/hooks-laba'
import classnames from 'classnames'
import {
  genGQLStrInGroup,
  groupOperations,
} from '@fruits-chain/graphql-kit-helpers'
import { copy } from '../content/operation-doc'
import styles from './index.module.less'
import type { CollapseProps } from 'antd'
import type { TypedOperation } from '@fruits-chain/graphql-kit-helpers'
import type { FC } from 'react'

export interface IProps {
  operations: TypedOperation[]
  keyword: string
  selectedOperationId: string
  onKeywordChange: (keyword: string) => void
  onSelect: (operation: TypedOperation) => void
}

const DocSidebar: FC<IProps> = ({
  keyword,
  onKeywordChange,
  operations,
  onSelect,
  selectedOperationId,
}) => {
  const [top, setTop] = useState(0)

  const onScroll = useThrottleFn(
    evt => {
      setTop(evt.nativeEvent.target.scrollTop)
    },
    { wait: 100 },
  )
  const groupedOperations = useMemo(() => {
    return groupOperations(operations)
  }, [operations])

  const contentJSX = useMemo(() => {
    return Object.entries(groupedOperations).map(
      ([groupName, operationData]) => {
        let operationList = operationData
        if (keyword.trim()) {
          const pattern = new RegExp(keyword, 'i')
          operationList = operationData.filter(item => {
            return (
              // search by name
              pattern.test(item.name) ||
              // search by description
              pattern.test(item.description || '') ||
              // search by arg type
              item.args.some(arg => pattern.test(arg.type.name)) ||
              // search by return type
              pattern.test(item.output.name)
            )
          })
        }
        if (!operationList.length) return null
        return (
          <Collapse.Panel key={groupName} header={groupName}>
            <div className={styles.operationList}>
              <Tooltip title="Copy GQL">
                <CopyOutlined
                  id={groupName}
                  data-clipboard-text={genGQLStrInGroup(
                    groupName,
                    operationList,
                  )}
                  className={styles.copyBtn}
                  onClick={() => {
                    copy(`#${groupName}`)
                  }}
                />
              </Tooltip>
              {operationList.map((operation, index) => {
                const deprecatedReason = operation.deprecationReason
                return (
                  <div
                    key={index}
                    className={classnames(styles.operationItem, {
                      [styles.active]:
                        operation.operationType + operation.name ===
                        selectedOperationId,
                    })}
                    onClick={() => {
                      onSelect(operation)
                    }}>
                    <div
                      className={classnames({
                        [styles.deprecated]: !!deprecatedReason,
                      })}>
                      <Space direction="vertical">
                        {operation.description || operation.name}
                        {!!deprecatedReason && (
                          <span className={styles.warning}>
                            {deprecatedReason}
                          </span>
                        )}
                      </Space>
                    </div>
                  </div>
                )
              })}
            </div>
          </Collapse.Panel>
        )
      },
    )
  }, [groupedOperations, keyword, onSelect, selectedOperationId])

  const defaultActiveKey = useMemo(() => {
    const activeKey: CollapseProps['defaultActiveKey'] = []
    // use [].some to break in advance
    Object.entries(groupedOperations).some(([groupName, items]) => {
      if (
        items.some(
          item => item.operationType + item.name === selectedOperationId,
        )
      ) {
        activeKey.push(groupName)
      }
    })
    return activeKey
  }, [])

  const [activeKey, setActiveKey] = useState(defaultActiveKey)

  return (
    <div className={styles.sidebar}>
      <Input.Search
        size="large"
        placeholder="Search by name/description/type"
        onChange={evt => {
          onKeywordChange(evt.target.value)
        }}
        value={keyword}
      />
      <div className={styles.main} id="sideBar" onScroll={onScroll.run}>
        <Collapse
          activeKey={activeKey}
          onChange={key => {
            if (Array.isArray(key)) {
              setActiveKey(key)
            }
          }}>
          {contentJSX}
        </Collapse>
      </div>
      <Tooltip title="Collapse all">
        <MinusCircleOutlined
          style={{ bottom: 100 }}
          className={classnames(styles.topBtn, {
            [styles.show]: activeKey.length,
          })}
          onClick={() => {
            setActiveKey([])
          }}
        />
      </Tooltip>
      <Tooltip title="Back to top">
        <UpCircleOutlined
          className={classnames(styles.topBtn, {
            [styles.show]: top > 800,
          })}
          onClick={() => {
            document.getElementById('sideBar')?.scrollTo(0, 0)
          }}
        />
      </Tooltip>
    </div>
  )
}

export default memo(DocSidebar)
