import type { ArgTypeDef, ObjectFieldTypeDef, ObjectTypeDef } from '.'
import type { TypedOperation } from './interface'

/**
 * generate a space string
 * @param count - the str length
 */
export const genSpace = (count: number) => {
  return ' '.repeat(count)
}

/**
 * generate a typeDef gql
 * @param typeDef - the type of operation
 * @param indent - the indent of gql
 */
const _genObjectFieldTypeDefStr = (
  objectField: ObjectFieldTypeDef,
  lineIndent: number,
  indent: number,
  allArgs: ArgTypeDef[],
) => {
  const { name, args, output } = objectField
  let str = `${genSpace(lineIndent)}${name}`
  if (args.length) {
    str += `(${args
      .map(item => {
        // if name is repeated, add index as suffix
        const sameNameArgLen = allArgs.filter(
          existItem => existItem.name === item.name,
        ).length
        const argName = `${item.name}${sameNameArgLen || ''}`
        // save all args in allArgs array
        allArgs.push({
          ...item,
          name: argName,
        })
        return `${item.name}: $${argName}`
      })
      .join(', ')})`
  }
  const genObjectTypeStr = (type: ObjectTypeDef, _lineIndent: number) => {
    return `${type.fields.reduce((fieldsStr, field) => {
      return (
        fieldsStr +
        _genObjectFieldTypeDefStr(field, _lineIndent, indent, allArgs)
      )
    }, '')}`
  }
  switch (output.kind) {
    case 'Scalar':
    case 'Enum':
      str += '\n'
      break
    case 'Object':
      str += `${genSpace(1)}{\n${genObjectTypeStr(
        output,
        lineIndent + indent,
      )}${genSpace(lineIndent)}}\n`
      break
    case 'Union':
      str += `${genSpace(1)}{${output.types.reduce((typesStr, type) => {
        return (
          typesStr +
          `${genSpace(lineIndent + indent)}...${genSpace(1)}on${genSpace(1)}${
            type.ofName
          }${genSpace(1)}{\n${genObjectTypeStr(
            type,
            lineIndent + indent * 2,
          )}${genSpace(lineIndent + indent)}}\n`
        )
      }, '\n')}${genSpace(lineIndent)}}\n`
      break
  }
  return str
}

/**
 * generate a gql string
 * @param operation - operation which need to be converted into a gql
 * @param indent - the indent of gql
 */
export const genGQLStr = (operation: TypedOperation, indent = 2) => {
  const descriptionStr = operation.description
    ? `# ${operation.description}\n`
    : ''

  const operationType = operation.operationType
  const operationName = operation.name
  const allArgs: ArgTypeDef[] = []
  const objectFieldTypeDefStr = _genObjectFieldTypeDefStr(
    operation,
    indent,
    indent,
    allArgs,
  )
  const outerArgsStr = `(${allArgs
    .map(item => `${item.name}: ${item.type.name}`)
    .join(', ')})`
  return `${descriptionStr}${operationType}${genSpace(
    1,
  )}${operationName}${outerArgsStr}${genSpace(1)}{\n${objectFieldTypeDefStr}}`
}

/**
 * generate a group of gqls
 * @param groupName - the name of group
 * @param operations - the operations in a group
 */
export const genGQLStrInGroup = (
  groupName: string,
  operations: TypedOperation[],
) => {
  return operations.reduce((str, operation, index) => {
    const isLast = index === operations.length - 1
    return str + genGQLStr(operation) + (isLast ? '\n' : '\n\n')
  }, `# ${groupName} \n\n`)
}
