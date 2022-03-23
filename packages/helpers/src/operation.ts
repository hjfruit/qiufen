import {
  getNamedType,
  isEnumType,
  isScalarType,
  isUnionType,
  OperationTypeNode,
} from 'graphql'
import type { InputType, ObjectTypeDef, OutputType } from '.'
import type {
  GraphQLField,
  GraphQLSchema,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLOutputType,
} from 'graphql'
import type { Operation, TypedOperation, ScalarMap } from './interface'

function _normalizeGraphqlInputType(
  type: GraphQLInputType,
  refChain: string[] = [],
): InputType {
  const namedType = getNamedType(type)
  const typeName = type.toString()
  const ofTypeName = namedType.name
  // handle ref cycle
  const refCount = refChain.filter(item => item === ofTypeName).length

  if (isScalarType(namedType)) {
    return {
      kind: 'Scalar',
      name: typeName,
      ofName: ofTypeName,
    }
  }
  if (isEnumType(namedType)) {
    return {
      kind: 'Enum',
      name: typeName,
      ofName: ofTypeName,
      values: namedType.getValues().map(item => ({
        name: item.name,
        description: item.description,
        value: item.value,
        deprecationReason: item.deprecationReason,
      })),
    }
  }
  return {
    kind: 'InputObject',
    name: typeName,
    ofName: ofTypeName,
    fields:
      refCount > 2
        ? []
        : Object.values(namedType.getFields()).map(item => {
            return {
              name: item.name,
              description: item.description,
              defaultValue: item.defaultValue,
              deprecationReason: item.deprecationReason,
              type: _normalizeGraphqlInputType(item.type, [
                ...refChain,
                namedType.name,
              ]),
            }
          }),
  }
}

function _normalizeObjectType(
  type: GraphQLInterfaceType | GraphQLObjectType<unknown, unknown>,
  typeName: string,
  refChain: string[] = [],
  scalarMap: ScalarMap = {},
): ObjectTypeDef {
  const refCount = refChain.filter(item => item === type.name).length

  return {
    kind: 'Object',
    name: typeName,
    ofName: type.name,
    fields:
      refCount > 2
        ? []
        : Object.values(type.getFields()).map(item => {
            return normalizeGraphqlField(item, scalarMap)
          }),
  }
}

function _normalizeGraphqlOutputType(
  type: GraphQLOutputType,
  refChain: string[] = [],
  scalarMap: ScalarMap = {},
): OutputType {
  const namedType = getNamedType(type)
  const typeName = type.toString()
  const ofTypeName = namedType.name
  const nextRefChain = [...refChain, ofTypeName]

  if (isScalarType(namedType)) {
    return {
      kind: 'Scalar',
      name: typeName,
      ofName: ofTypeName,
    }
  }
  if (isEnumType(namedType)) {
    return {
      kind: 'Enum',
      name: typeName,
      ofName: ofTypeName,
      values: namedType.getValues().map(item => ({
        name: item.name,
        description: item.description,
        value: item.value,
        deprecationReason: item.deprecationReason,
      })),
    }
  }
  if (isUnionType(namedType)) {
    return {
      kind: 'Union',
      name: typeName,
      ofName: ofTypeName,
      types: namedType.getTypes().map(item => {
        return _normalizeObjectType(item, item.name, nextRefChain, scalarMap)
      }),
    }
  }
  return _normalizeObjectType(namedType, typeName, nextRefChain, scalarMap)
}

/**
 * normalize a GraphqlField instance
 * @param graphQLField - a GraphQLField instance
 * @param scalarMap - a value map used to set the default value for each scalar type
 */
export function normalizeGraphqlField(
  graphQLField: GraphQLField<unknown, unknown>,
  scalarMap: ScalarMap,
): Operation {
  const args: Operation['args'] = graphQLField?.args.map(item => {
    return {
      name: item.name,
      description: item.description,
      defaultValue: item.defaultValue,
      deprecationReason: item.deprecationReason,
      type: _normalizeGraphqlInputType(item.type),
    }
  })
  const argsExample = genArgsExample(args, scalarMap)

  const output: Operation['output'] = _normalizeGraphqlOutputType(
    graphQLField.type,
    [],
    scalarMap,
  )
  const outputExample = genOutputExample(output, scalarMap)
  return {
    name: graphQLField.name,
    description: graphQLField.description,
    deprecationReason: graphQLField.deprecationReason,
    args,
    argsExample: argsExample,
    output,
    outputExample: { [graphQLField.name]: outputExample },
  }
}

/**
 * get all operations by schema
 * @param schema - GraphqlSchema instance
 * @param scalarMap - A map of scalar default value
 */
export function getOperationsBySchema(
  schema: GraphQLSchema,
  scalarMap: ScalarMap = {},
): TypedOperation[] {
  return [
    ...Object.values(schema.getQueryType()?.getFields() || {}).map(
      operationField => {
        return {
          ...normalizeGraphqlField(operationField, scalarMap),
          operationType: OperationTypeNode.QUERY,
        }
      },
    ),
    ...Object.values(schema.getMutationType()?.getFields() || {}).map(
      operationField => {
        return {
          ...normalizeGraphqlField(operationField, scalarMap),
          operationType: OperationTypeNode.MUTATION,
        }
      },
    ),
    ...Object.values(schema.getSubscriptionType()?.getFields() || {}).map(
      operationField => {
        return {
          ...normalizeGraphqlField(operationField, scalarMap),
          operationType: OperationTypeNode.SUBSCRIPTION,
        }
      },
    ),
  ]
}

/**
 * grouping logic
 * @param operation - the operation need to be grouped
 */
const _groupBy: GroupByFn = (operation: TypedOperation) => {
  const [groupName, description] = operation.description?.includes(':')
    ? operation.description.split(/[:]\s*/)
    : ['default', operation.description]
  const groupOperation = { ...operation, description }
  return { groupName, operation: groupOperation }
}

export interface GroupByFn {
  (operation: TypedOperation): { groupName: string; operation: TypedOperation }
}

/**
 * separate operations into some groups
 * @param operations - the operations need to be grouped
 * @param groupBy - the grouping logic function
 */
export function groupOperations(
  operations: TypedOperation[],
  groupBy: GroupByFn = _groupBy,
) {
  const groupMap: Record<string, TypedOperation[]> = {}
  operations.forEach(originOperation => {
    const { groupName, operation } = groupBy(originOperation)
    if (groupMap[groupName]) {
      groupMap[groupName].push(operation)
    } else {
      groupMap[groupName] = [operation]
    }
  })
  return groupMap
}

function genListTypeValue(typeName: string, value: unknown) {
  const listPattern = /^\[(.+)\]!?$/
  let ofTypeName = typeName.match(listPattern)?.[1]
  let result = value

  while (ofTypeName) {
    result = [result]
    ofTypeName = ofTypeName.match(listPattern)?.[1]
  }
  return result
}

/**
 * generate a input object
 * @param args - the arguments of operation
 * @param scalarMap - a map contains the default value of scalar type
 */
export const genArgsExample = (
  args: Operation['args'],
  scalarMap: ScalarMap,
) => {
  const argsExample: Record<string, unknown> = {}
  args.forEach(({ name, type }) => {
    let result
    let scalarHandler
    switch (type.kind) {
      case 'Scalar':
        scalarHandler = scalarMap[type.ofName]
        result = scalarHandler
          ? typeof scalarHandler === 'function'
            ? scalarHandler()
            : scalarHandler
          : null
        break
      case 'Enum':
        result = type.values[0].value
        break
      case 'InputObject':
        result = genArgsExample(type.fields, scalarMap)
        break
    }
    argsExample[name] = genListTypeValue(type.name, result)
  })
  return argsExample
}

/**
 * generate a return object
 * @param returnData - the return data of operation
 * @param scalarMap - a map contains the default value of scalar type
 */
export const genOutputExample = (
  output: Operation['output'],
  scalarMap: ScalarMap,
) => {
  let result: unknown
  let scalarHandler
  const typeName = output.name

  switch (output.kind) {
    case 'Scalar':
      scalarHandler = scalarMap[output.ofName]
      result = scalarHandler
        ? typeof scalarHandler === 'function'
          ? scalarHandler()
          : scalarHandler
        : null
      break
    case 'Enum':
      result = output.values[0].value
      break
    case 'Object':
      result = {}
      output.fields.forEach(field => {
        ;(result as Record<string, unknown>)[field.name] = genOutputExample(
          field.output,
          scalarMap,
        )
      })
      break
    case 'Union':
      result = {}
      output.types[0].fields.forEach(field => {
        ;(result as Record<string, unknown>)[field.name] = genOutputExample(
          field.output,
          scalarMap,
        )
      })
      break
  }
  return genListTypeValue(typeName, result)
}
