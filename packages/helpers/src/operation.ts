import {
  getNamedType,
  isEnumType,
  isScalarType,
  isUnionType,
  OperationTypeNode,
} from 'graphql'
import type {
  GraphQLField,
  GraphQLInputFieldMap,
  GraphQLNamedType,
  GraphQLSchema,
  GraphQLFieldMap,
} from 'graphql'
import type {
  FieldTypeDef,
  Operation,
  TypedOperation,
  TypeDef,
  OperationArgument,
  ScalarMap,
} from './interface'

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
 * @param graphQLField - GraphQLField instance from which should be extracted
 * @param schema - GraphQLSchema instance
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
 * @param schema - GraphqlSchema instance
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
 * @param operation - the operation need to be grouped
 */
const _groupBy: GroupByFn = (operation: TypedOperation) => {
  const [groupName, description] = operation.description.includes(':')
    ? operation.description.split(/:\s*/)
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

/**
 * generate a variables object
 * @param args - the arguments of operation
 * @param scalarMap - a map contains the default value of scalar type
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
      const valueHandler = scalarMap[type]
      defaultValue = valueHandler
        ? typeof valueHandler === 'function'
          ? valueHandler()
          : valueHandler
        : null
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
