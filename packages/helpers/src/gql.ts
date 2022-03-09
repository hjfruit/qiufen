import type { OperationArgument, TypedOperation, TypeDef } from './interface'

/**
 * generate a space string
 * @param count - the str length
 */
export const genSpace = (count: number) => {
  return ' '.repeat(count)
}

/**
 * generate an outer arguments string
 * @param args - the arguments of operation
 */
const _genOuterArgumentsStr = (args: OperationArgument[]) => {
  if (args.length) {
    return `(${args.map(item => `$${item.name}: ${item.type}`).join(', ')})`
  }
  return ''
}

/**
 * generate an inner arguments string
 * @param args - operation's arguments
 */
const _genInnerArgumentsStr = (args: OperationArgument[]) => {
  if (args.length) {
    return `(${args.map(item => `${item.name}: $${item.name}`).join(', ')})`
  }
  return ''
}

/**
 * generate a typeDef gql
 * @param typeDef - the type of operation
 * @param indent - the indent of gql
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
 * @param operation - operation which need to be converted into a gql
 * @param indent - the indent of gql
 */
export const genGQLStr = (operation: TypedOperation, indent = 2) => {
  const returnTypeDef = operation.return.typeDef
  const descriptionStr = operation.description
    ? `# ${operation.description}\n`
    : ''
  return `${descriptionStr}${operation.type}${genSpace(1)}${
    operation.name
  }${_genOuterArgumentsStr(operation.arguments)}${genSpace(1)}{\n${genSpace(
    indent,
  )}${operation.name}${_genInnerArgumentsStr(operation.arguments)}${
    returnTypeDef ? _genTypeDefStr(returnTypeDef, indent + indent) : '\n'
  }}`
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
