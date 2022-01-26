import React, { memo, useMemo, useState } from 'react'
import { Input, Collapse, Tooltip } from 'antd'
import { UpCircleOutlined, CopyOutlined } from '@ant-design/icons'
import { useThrottleFn } from '@fruits-chain/hooks-laba'
import classnames from 'classnames'
import { genGQLStrInGroup, groupOperations } from '@graphql-kit/helpers'
import { copy } from '../content/operation-doc'
import styles from './index.module.less'
import type { TypedOperation } from '@graphql-kit/helpers'
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
              pattern.test(item.description) ||
              // search by arg type
              item.arguments.some(arg => pattern.test(arg.type)) ||
              // search by return type
              pattern.test(item.return.type)
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
                const deprecated = operation.directives?.find(
                  item => item.name.value === 'deprecated',
                )
                const deprecatedReason =
                  deprecated?.arguments?.find(
                    item => item.name.value === 'reason',
                  )?.value || 'deprecated'
                return (
                  <div
                    key={index}
                    className={classnames(styles.operationItem, {
                      [styles.active]:
                        operation.type + operation.name === selectedOperationId,
                    })}
                    onClick={() => {
                      onSelect(operation)
                    }}>
                    <div>
                      <span
                        className={classnames({
                          [styles.deprecated]: !!deprecated,
                        })}>
                        {operation.description || operation.name}
                      </span>
                      {!!deprecated && (
                        <span className={styles.warning}>
                          {deprecatedReason}
                        </span>
                      )}
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
        <Collapse defaultActiveKey={Object.keys(groupedOperations)}>
          {contentJSX}
        </Collapse>
      </div>
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
