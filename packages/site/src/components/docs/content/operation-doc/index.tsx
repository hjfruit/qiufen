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
  TypedOperation,
  ArgTypeDef,
  ObjectFieldTypeDef,
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

type ArgColumnRecord = {
  key: string
  name: ArgTypeDef['name']
  type: ArgTypeDef['type']['name']
  defaultValue: ArgTypeDef['defaultValue']
  description: ArgTypeDef['description']
  deprecationReason?: ArgTypeDef['deprecationReason']
  children: ArgColumnRecord[] | null
}

const getArgsTreeData = (args: ArgTypeDef[], keyPrefix = '') => {
  const result: ArgColumnRecord[] = args.map(({ type, ...originData }) => {
    const key = `${keyPrefix}${originData.name}`
    let children: ArgColumnRecord['children'] = []
    switch (type.kind) {
      case 'Scalar':
        children = null
        break
      case 'InputObject':
        children = getArgsTreeData(type.fields, key)
        break
      case 'Enum':
        children = type.values.map(item => ({
          key: key + item.value,
          name: item.name,
          type: '',
          defaultValue: item.value,
          description: item.description,
          deprecationReason: item.deprecationReason,
          children: null,
        }))
        break
    }
    return {
      ...originData,
      key,
      type: type.name,
      children,
    }
  })
  return result
}

const getObjectFieldsTreeData = (
  objectFields: ObjectFieldTypeDef[],
  keyPrefix = '',
) => {
  const result: ArgColumnRecord[] = objectFields.map(
    ({ output, ...originData }) => {
      const key = `${keyPrefix}${originData.name}`
      let children: ArgColumnRecord['children'] = []
      switch (output.kind) {
        case 'Scalar':
          children = null
          break
        case 'Object':
          children = getObjectFieldsTreeData(output.fields, key)
          break
        case 'Enum':
          children = output.values.map(item => ({
            key: key + item.value,
            name: item.name,
            type: '',
            defaultValue: item.value,
            description: item.description,
            deprecationReason: item.deprecationReason,
            children: null,
          }))
          break
        case 'Union':
          output.types.forEach(type => {
            children = [
              ...(children || []),
              ...getObjectFieldsTreeData(type.fields, key),
            ]
            type.fields
          })
      }
      return {
        ...originData,
        key,
        defaultValue: null,
        type: output.name,
        children,
      }
    },
  )
  return result
}

const columnGen = (
  field: 'arguments' | 'return',
): ColumnsType<ArgColumnRecord> => {
  return [
    {
      title: 'name',
      dataIndex: 'name',
      width: '35%',
      render(value, record) {
        const deprecationReason = record.deprecationReason
        if (deprecationReason) {
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
        const deprecationReason = record.deprecationReason
        if (deprecationReason) {
          return (
            <>
              {val}
              <span className={styles.warning}>{deprecationReason}</span>
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
      render(val: string) {
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
      render(value: string) {
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

  const argsTreeData = useMemo(() => {
    return getArgsTreeData(operation.args)
  }, [operation.args])
  const argsColumns: ColumnsType<ArgColumnRecord> = useMemo(() => {
    return columnGen('arguments')
  }, [])

  const objectFieldsTreeData = useMemo(() => {
    return getObjectFieldsTreeData([operation])
  }, [])
  const objectFieldsColumns: ColumnsType<ArgColumnRecord> = useMemo(() => {
    return columnGen('return')
  }, [])

  const gqlStr = useMemo(() => {
    return genGQLStr(operation)
  }, [operation])

  const handleDebug = () => {
    window.open(
      `${config.host}/graphql/playground?operationName=${encodeURIComponent(
        operation.name,
      )}&operationType=${encodeURIComponent(operation.operationType)}`,
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
      <div>Operation type: {operation.operationType}</div>
      {!!argsTreeData.length && (
        <>
          <div>Params: </div>
          {mode === 'TABLE' ? (
            <Table
              columns={argsColumns}
              defaultExpandAllRows
              className={styles.table}
              dataSource={argsTreeData}
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
              value={obj2str(operation.argsExample)}
            />
          )}
        </>
      )}
      <div>Response: </div>
      {mode === 'TABLE' ? (
        <Table
          columns={objectFieldsColumns}
          defaultExpandAllRows
          className={styles.table}
          dataSource={objectFieldsTreeData}
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
          value={obj2str(operation.outputExample)}
          editorProps={{
            $blockScrolling: false,
          }}
        />
      )}
    </Space>
  )
}

export default OperationDoc
