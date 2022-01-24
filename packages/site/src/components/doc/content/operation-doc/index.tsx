import React, { useMemo } from 'react'
import { message, Space, Table, Tooltip } from 'antd'
import { CopyOutlined, PlayCircleOutlined } from '@ant-design/icons'
import ClipboardJS from 'clipboard'
import { genGQLStr, genVariables } from '@graphql-kit/helpers'
import styles from './index.module.less'
import type {
  OperationArgument,
  TypedOperation,
  OperationReturn,
  Directives,
} from '@graphql-kit/helpers'
import type { ColumnsType } from 'antd/lib/table'
import type { FC } from 'react'

interface IProps {
  operation: TypedOperation
}

const obj2str = (target: object) => {
  return JSON.stringify(target, null, 2)
}

type ColumnRecord = {
  name: string
  description: string
  isEnum: boolean
  key: string
  directives: Directives
  children: ColumnRecord[] | null
}

const convertDocDataToTreeData = (
  operation: (OperationArgument | OperationReturn)[],
) => {
  const result: ColumnRecord[] = operation.map(({ typeDef, ...originData }) => {
    const isEnum = Array.isArray(typeDef)
    return {
      ...originData,
      isEnum,
      key: originData.name,
      children: !typeDef
        ? null
        : convertDocDataToTreeData(
            isEnum
              ? typeDef.map(item => ({
                  name: (item.value as string | number).toString(),
                  description: item.description,
                  directives: item.directives,
                  type: '',
                  typeDef: undefined,
                }))
              : Object.entries(typeDef).map(([argName, argInfo]) => {
                  return {
                    name: argName,
                    ...argInfo,
                  }
                }),
          ),
    }
  })
  return result
}

const columnGen = (
  field: 'arguments' | 'return',
): ColumnsType<ColumnRecord> => {
  return [
    {
      title: '参数名称',
      dataIndex: 'name',
      width: '35%',
      render(value, record) {
        const deprecated = record.directives?.find(
          item => item.name.value === 'deprecated',
        )
        if (deprecated) {
          return <span className={styles.deprecated}>{value}</span>
        }
        return value
      },
    },
    {
      title: '参数说明',
      dataIndex: 'description',
      width: '25%',
      render(val, record) {
        const deprecated = record.directives?.find(
          item => item.name.value === 'deprecated',
        )
        if (deprecated) {
          const reasonArg = deprecated.arguments?.find(
            item => item.name.value === 'reason',
          )
          return (
            <>
              {val}
              <span className={styles.warning}>
                {reasonArg?.value || '已废弃'}
              </span>
            </>
          )
        }
        return val || '无'
      },
    },
    {
      title: field === 'arguments' ? '是否必填' : '可否为空',
      dataIndex: 'type',
      width: '20%',
      render(val: string, record) {
        if (record.isEnum) return ''
        let result = !val?.endsWith('!')
        if (field === 'arguments') {
          result = !!val?.endsWith('!')
        }
        if (result === true) {
          return <span style={{ color: '#f5222d' }}>true</span>
        }
        return 'false'
      },
    },
    {
      title: '参数类型',
      dataIndex: 'type',
      width: '20%',
      render(value: string, record) {
        if (record.isEnum) {
          return 'Enum'
        }
        return value?.endsWith('!') ? value.slice(0, value.length - 1) : value
      },
    },
  ]
}

export const copy = (selector: string) => {
  const clipboard = new ClipboardJS(selector)
  clipboard.on('success', () => {
    message.success('复制成功')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    message.error('复制失败')
    clipboard.destroy()
  })
}

const OperationDoc: FC<IProps> = ({ operation }) => {
  const argumentsData = useMemo(() => {
    return convertDocDataToTreeData(operation.arguments)
  }, [operation.arguments])
  const argumentsColumns: ColumnsType<ColumnRecord> = useMemo(() => {
    return columnGen('arguments')
  }, [])

  const returnData = useMemo(() => {
    return convertDocDataToTreeData([operation.return])
  }, [operation.return])
  const returnColumns: ColumnsType<ColumnRecord> = useMemo(() => {
    return columnGen('return')
  }, [])

  const gqlStr = useMemo(() => {
    return genGQLStr(operation)
  }, [operation])

  const variablesStr = useMemo(() => {
    const variables = genVariables(operation.arguments, {})
    return obj2str(variables)
  }, [operation.arguments])

  const handleDebug = () => {
    window.open(
      `/graphql/playground?query=${encodeURIComponent(
        gqlStr,
      )}&variables=${encodeURIComponent(variablesStr)}`,
      '_blank',
    )
  }

  return (
    <Space
      id={operation.name}
      className={styles.operationDoc}
      direction="vertical">
      <div className={styles.name}>
        <Space size={24}>
          <span>请求名称：{operation.name}</span>
          <span>
            <Tooltip title="复制GQL">
              <CopyOutlined
                id="copy"
                data-clipboard-text={gqlStr}
                className={styles.copyBtn}
                onClick={() => {
                  copy('#copy')
                }}
              />
            </Tooltip>
          </span>
          <span>
            <Tooltip title="调试">
              <PlayCircleOutlined
                className={styles.copyBtn}
                onClick={handleDebug}
              />
            </Tooltip>
          </span>
        </Space>
      </div>
      <div>请求类型：{operation.type}</div>
      {!!argumentsData.length && (
        <>
          <div>请求参数：</div>
          <Table
            columns={argumentsColumns}
            dataSource={argumentsData}
            pagination={false}
            bordered
          />
        </>
      )}
      <div>响应参数：</div>
      <Table
        columns={returnColumns}
        dataSource={returnData}
        pagination={false}
        bordered
      />
    </Space>
  )
}

export default OperationDoc
