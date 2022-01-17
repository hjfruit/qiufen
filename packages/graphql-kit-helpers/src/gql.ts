import { OperationTypeNode } from 'graphql'
import {
  Operation,
  OperationArgument,
  TypedOperation,
  ScalarMap,
  TypeDef,
} from './types'

/**
 * generate a space string
 * @param count the str length
 */
export const genSpace = (count: number) => {
  return ' '.repeat(count)
}

/**
 * generate an outer arguments string
 * @param args the arguments of operation
 */
const _genOuterArgumentsStr = (args: OperationArgument[]) => {
  if (args.length) {
    return `(${args.map(item => `$${item.name}: ${item.type}`).join(', ')})`
  }
  return ''
}

/**
 * generate an inner arguments string
 * @param args operation's arguments
 */
const _genInnerArgumentsStr = (args: OperationArgument[]) => {
  if (args.length) {
    return `(${args.map(item => `${item.name}: $${item.name}`).join(', ')})`
  }
  return ''
}

/**
 * generate a typeDef gql
 * @param args the type of operation
 * @param indent the indent of gql
 */
const _genTypeDefStr = (typeDef: TypeDef, indent: number) => {
  if (!typeDef) return '\n'
  let str = ''
  if (Array.isArray(typeDef)) {
    str += '\n'
  } else {
    str += ` {\n`
    const fields = Object.entries(typeDef)
    fields.forEach(([field, fieldInfo]) => {
      str += `${genSpace(indent)}${field}`
      str += _genTypeDefStr(fieldInfo.typeDef, indent + 2)
    })
    str += `${genSpace(indent - 2)}}\n`
  }
  return str
}

/**
 * generate a gql string
 * @param operationType the type of operation
 * @param operation operation which need to be converted into a gql
 * @param indent the indent of gql
 */
export const genGQLStr = (
  operationType: OperationTypeNode,
  operation: Operation,
  indent = 2,
) => {
  const returnTypeDef = operation.return.typeDef
  const descriptionStr = operation.description
    ? `# ${operation.description}\n`
    : ''
  return `${descriptionStr}${operationType}${genSpace(1)}${
    operation.name
  }${_genOuterArgumentsStr(operation.arguments)}${genSpace(1)}{\n${genSpace(
    indent,
  )}${operation.name}${_genInnerArgumentsStr(operation.arguments)}${
    returnTypeDef ? _genTypeDefStr(returnTypeDef, indent + indent) : '\n'
  }}`
}

/**
 * generate a variables object
 * @param args the arguments of operation
 * @param scalarMap a map contains the default value of scalar type
 */
export const genVariables = (
  args: OperationArgument[],
  scalarMap: ScalarMap,
) => {
  const variables: Record<string, unknown> = {}
  args.forEach(({ name, type, typeDef }) => {
    let defaultValue
    if (!typeDef) {
      // scalar type
      defaultValue = scalarMap[type]
    } else if (Array.isArray(typeDef)) {
      // enum type
      defaultValue = typeDef[0].value
    } else {
      // object type
      const subArgs = Object.entries(typeDef).map(
        ([fieldName, fieldTypeDef]) => {
          return {
            name: fieldName,
            ...fieldTypeDef,
          }
        },
      )
      defaultValue = genVariables(subArgs, scalarMap)
    }
    variables[name] = defaultValue
  })
  return variables
}

/**
 * generate a group of gqls
 * @param groupName the name of group
 * @param operations the operations in a group
 */
export const genGQLStrInGroup = (
  groupName: string,
  operations: TypedOperation[],
) => {
  return operations.reduce((str, { type, ...operation }, index) => {
    const isLast = index === operations.length - 1
    return str + genGQLStr(type, operation) + (isLast ? '\n' : '\n\n')
  }, `# ${groupName} \n\n`)
}
