import React, { useMemo } from 'react'
import { message, Space, Table, Tooltip, Switch } from 'antd'
import { CopyOutlined, PlayCircleOutlined } from '@ant-design/icons'
import ClipboardJS from 'clipboard'
import { genGQLStr } from '@fruits-chain/graphql-kit-helpers'
import dynamic from 'next/dynamic'
import { useToggle } from '@fruits-chain/hooks-laba'
import obj2str from 'stringify-object'
import styles from './index.module.less'
import type { IAceEditorProps } from 'react-ace'
import type {
  OperationArgument,
  TypedOperation,
  OperationReturn,
  Directives,
} from '@fruits-chain/graphql-kit-helpers'
import type { ColumnsType } from 'antd/lib/table'
import type { FC } from 'react'
import config from '@/config'

const AceEditor = dynamic<IAceEditorProps>(
  import('react-ace').then(Comp => {
    return Promise.all([
      import('ace-builds/src-noconflict/mode-javascript'),
      import('ace-builds/src-noconflict/theme-tomorrow'),
    ]).then(() => {
      return Comp.default
    })
  }),
  { ssr: false },
)

interface IProps {
  operation: TypedOperation
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
  keyPrefix = '',
) => {
  const result: ColumnRecord[] = operation.map(({ typeDef, ...originData }) => {
    const isEnum = Array.isArray(typeDef)
    const key = `${keyPrefix}${originData.name}`
    return {
      ...originData,
      isEnum,
      key,
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
            key,
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
      title: 'name',
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
      title: 'description',
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
                {reasonArg?.value.kind === 'StringValue'
                  ? reasonArg?.value.value
                  : 'deprecated'}
              </span>
            </>
          )
        }
        return val
      },
    },
    {
      title: field === 'arguments' ? 'required' : 'nullable',
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
      title: 'type',
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
    message.success('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    message.error('failed')
    clipboard.destroy()
  })
}

const OperationDoc: FC<IProps> = ({ operation }) => {
  const [mode, { toggle: toggleMode }] = useToggle<'TABLE', 'EDITOR'>(
    'TABLE',
    'EDITOR',
  )

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

  const handleDebug = () => {
    window.open(
      `${config.host}/graphql/playground?operationName=${encodeURIComponent(
        operation.name,
      )}&operationType=${encodeURIComponent(operation.type)}`,
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
          <span>Operation name: {operation.name}</span>
          <span>
            <Tooltip title="Copy GQL">
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
            <Tooltip title="Debug">
              <PlayCircleOutlined
                className={styles.copyBtn}
                onClick={handleDebug}
              />
            </Tooltip>
          </span>
          <Switch
            size="small"
            checked={mode === 'EDITOR'}
            checkedChildren="editor"
            unCheckedChildren="table"
            onChange={() => {
              toggleMode()
            }}
          />
        </Space>
      </div>
      <div>Operation type: {operation.type}</div>
      {!!argumentsData.length && (
        <>
          <div>Params: </div>
          {mode === 'TABLE' ? (
            <Table
              columns={argumentsColumns}
              dataSource={argumentsData}
              pagination={false}
              bordered
            />
          ) : (
            <AceEditor
              theme="tomorrow"
              mode="javascript"
              width="100%"
              readOnly
              maxLines={Infinity}
              value={obj2str(operation.argumentsExample)}
            />
          )}
        </>
      )}
      <div>Response: </div>
      {mode === 'TABLE' ? (
        <Table
          columns={returnColumns}
          dataSource={returnData}
          pagination={false}
          bordered
        />
      ) : (
        <AceEditor
          theme="tomorrow"
          mode="javascript"
          width="100%"
          readOnly
          maxLines={Infinity}
          value={obj2str(operation.returnExample)}
          editorProps={{
            $blockScrolling: false,
          }}
        />
      )}
    </Space>
  )
}

export default OperationDoc
