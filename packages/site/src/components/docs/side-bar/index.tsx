import React, { memo, useMemo, useState } from 'react'
import { Input, Collapse, Tooltip, Space } from 'antd'
import { CopyOutlined, SearchOutlined } from '@ant-design/icons'
import { useThrottleFn } from '@fruits-chain/hooks-laba'
import classnames from 'classnames'
import { genGQLStrInGroup, groupOperations } from '@fruits-chain/qiufen-helpers'
import Image from 'next/image'
import { copy } from '../content/operation-doc'
import styles from './index.module.less'
import type { CollapseProps } from 'antd'
import type { TypedOperation } from '@fruits-chain/qiufen-helpers'
import type { FC } from 'react'
import collapseAll from '@/assets/images/collapse-all.png'
import backTop from '@/assets/images/back-top.png'

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

  const contentJSX = useMemo(() => {
    return Object.entries(groupedOperations).map(
      ([groupName, operationData]) => {
        let operationList = operationData
        const pattern = new RegExp(keyword, 'i')
        // search by group name
        if (pattern.test(groupName)) {
          // break
        } else if (keyword.trim()) {
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
          <Collapse.Panel
            key={groupName}
            header={groupName}
            className={
              activeKey.includes(groupName) ? styles.collapse_active : ''
            }>
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
  }, [groupedOperations, keyword, onSelect, selectedOperationId, activeKey])

  const [isFocus, setIsFocus] = useState(false)

  return (
    <div className={styles.sidebar}>
      <div className={styles.wrapper_search}>
        <Input
          className={styles.search}
          onFocus={() => {
            setIsFocus(true)
          }}
          onBlur={() => {
            setIsFocus(false)
          }}
          suffix={
            <SearchOutlined className={isFocus ? styles.icon_color : ''} />
          }
          size="large"
          placeholder="Search by group/desc/name/type"
          onChange={evt => {
            onKeywordChange(evt.target.value)
          }}
          value={keyword}
        />
      </div>
      <div className={styles.main} id="sideBar" onScroll={onScroll.run}>
        <Collapse
          className={styles.collapse_box}
          bordered={false}
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
        <div
          style={{ bottom: 100 }}
          className={classnames(styles.topBtn, {
            [styles.show]: activeKey.length,
          })}
          onClick={() => {
            setActiveKey([])
          }}>
          <Image src={collapseAll} width={32} height={32} />
        </div>
      </Tooltip>
      <Tooltip title="Back to top">
        <div
          className={classnames(styles.topBtn, {
            [styles.show]: top > 800,
          })}
          onClick={() => {
            document.getElementById('sideBar')?.scrollTo(0, 0)
          }}>
          <Image src={backTop} width={32} height={32} />
        </div>
      </Tooltip>
    </div>
  )
}

export default memo(DocSidebar)
