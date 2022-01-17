import {
  getNamedType,
  GraphQLField,
  GraphQLInputFieldMap,
  GraphQLNamedType,
  GraphQLSchema,
  isEnumType,
  isScalarType,
  isUnionType,
  OperationTypeNode,
} from 'graphql'
import type { GraphQLFieldMap } from 'graphql'
import type { FieldTypeDef, Operation, TypedOperation, TypeDef } from './types'

/**
 * get type definition from GraphQLFieldMap or GraphQLInputFieldMap instance
 * @param fieldMap - GraphQLFieldMap or GraphQLInputFieldMap instance from which should be extracted
 */
function _getObjectTypeDefFromGraphQLFieldMap(
  fieldMap: GraphQLFieldMap<unknown, unknown> | GraphQLInputFieldMap,
) {
  const result: Record<string, FieldTypeDef> = {}
  Object.keys(fieldMap).forEach(fieldName => {
    const field = fieldMap[fieldName]
    const namedType = getNamedType(field.type)
    result[fieldName] = {
      description: field.description || '',
      type: namedType.name,
      directives: field.astNode?.directives || [],
      typeDef: _getTypeDefFromGraphQLNamedType(namedType),
    }
  })
  return result
}

/**
 * get type definition from GraphQLNamedType instance
 * @param namedType - GraphQLNamedType instance from which should be extracted
 */
function _getTypeDefFromGraphQLNamedType(namedType: GraphQLNamedType): TypeDef {
  // if the type is scalar, typeDef should be undefined
  if (isScalarType(namedType)) {
    return undefined
  }
  // if the type is enum, return an array of enum item
  if (isEnumType(namedType)) {
    return namedType.getValues().map(item => ({
      name: item.name,
      description: item.description || '',
      directives: item.astNode?.directives || [],
      value: item.value,
    }))
  }
  // if the type is union, return the object including all fields
  if (isUnionType(namedType)) {
    return namedType
      .getTypes()
      .map(item => {
        return _getObjectTypeDefFromGraphQLFieldMap(item.getFields())
      })
      .reduce((result, item) => {
        return { ...result, ...item }
      }, {})
  }
  // type should be an instance of Object here
  return _getObjectTypeDefFromGraphQLFieldMap(namedType.getFields())
}

/**
 * TODO:handle circular ref
 * get operation info from a GraphQLField instance
 * @param graphQLField GraphQLField instance from which should be extracted
 * @param schema GraphQLSchema instance
 */
export function getOperationFromGraphQLField(
  graphQLField: GraphQLField<unknown, unknown>,
  schema: GraphQLSchema,
): Operation {
  const typeMap = schema.getTypeMap()
  const returnTypeName = getNamedType(graphQLField.type).name
  const returnType = typeMap[returnTypeName]
  return {
    name: graphQLField?.name,
    description: graphQLField?.description || '',
    directives: graphQLField.astNode?.directives || [],
    arguments: graphQLField?.args.map(item => {
      const argTypeName = getNamedType(item.type).name
      const argType = typeMap[argTypeName]
      return {
        name: item.name,
        description: item.description || '',
        directives: item.astNode?.directives || [],
        type: argTypeName,
        typeDef: _getTypeDefFromGraphQLNamedType(argType),
      }
    }),
    return: {
      name: graphQLField.name,
      directives: returnType.astNode?.directives || [],
      description: returnType.astNode?.description?.value || '',
      type: returnTypeName,
      typeDef: _getTypeDefFromGraphQLNamedType(returnType),
    },
  }
}

/**
 * get all operations by schema
 * @param schema GraphqlSchema instance
 */
export function getOperationsBySchema(schema: GraphQLSchema): TypedOperation[] {
  return [
    ...Object.values(schema.getQueryType()?.getFields() || {}).map(
      operationField => {
        return {
          ...getOperationFromGraphQLField(operationField, schema),
          type: OperationTypeNode.QUERY,
        }
      },
    ),
    ...Object.values(schema.getMutationType()?.getFields() || {}).map(
      operationField => {
        return {
          ...getOperationFromGraphQLField(operationField, schema),
          type: OperationTypeNode.MUTATION,
        }
      },
    ),
    ...Object.values(schema.getSubscriptionType()?.getFields() || {}).map(
      operationField => {
        return {
          ...getOperationFromGraphQLField(operationField, schema),
          type: OperationTypeNode.SUBSCRIPTION,
        }
      },
    ),
  ]
}

/**
 * grouping logic
 * @param operation the operation need to be grouped
 */
function _group(operation: TypedOperation) {
  const [groupName, description] = operation.description.includes(':')
    ? operation.description.split(/:\s*/)
    : ['default', operation.description]
  const groupOperation = { ...operation, description }
  return { groupName, operation: groupOperation }
}

/**
 * separate operations into some groups
 * @param operations the operations need to be grouped
 * @param group the grouping logic function
 */
export function groupOperations(operations: TypedOperation[], group = _group) {
  const groupMap: Record<string, TypedOperation[]> = {}
  operations.forEach(originOperation => {
    const { groupName, operation } = group(originOperation)
    if (groupMap[groupName]) {
      groupMap[groupName].push(operation)
    } else {
      groupMap[groupName] = [operation]
    }
  })
  return groupMap
}
