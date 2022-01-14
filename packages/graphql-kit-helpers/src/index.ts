import {
  getNamedType,
  GraphQLField,
  GraphQLInputFieldMap,
  GraphQLNamedType,
  GraphQLSchema,
  isEnumType,
  isScalarType,
  isUnionType,
} from 'graphql'
import type { GraphQLFieldMap } from 'graphql'
import type { FieldTypeDef, Operation, TypeDef } from './types'
export type { FieldTypeDef, Operation, TypeDef }

/**
 * extract type definition from GraphQLFieldMap or GraphQLInputFieldMap instance
 * @param fieldMap - GraphQLFieldMap or GraphQLInputFieldMap instance from which should be extracted
 */
export function getObjectTypeDefFromGraphQLFieldMap(
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
      typeDef: getTypeDefFromGraphQLNamedType(namedType),
    }
  })
  return result
}

/**
 * extract type definition from GraphQLNamedType instance
 * @param namedType - GraphQLNamedType instance from which should be extracted
 */
export function getTypeDefFromGraphQLNamedType(
  namedType: GraphQLNamedType,
): TypeDef {
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
        return getObjectTypeDefFromGraphQLFieldMap(item.getFields())
      })
      .reduce((result, item) => {
        return { ...result, ...item }
      }, {})
  }
  // type should be an instance of Object here
  return getObjectTypeDefFromGraphQLFieldMap(namedType.getFields())
}

/**
 * TODO:avoid circular ref
 * extract operation info from a GraphQLField instance
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
        typeDef: getTypeDefFromGraphQLNamedType(argType),
      }
    }),
    return: {
      name: graphQLField.name,
      directives: returnType.astNode?.directives || [],
      description: returnType.astNode?.description?.value || '',
      type: returnTypeName,
      typeDef: getTypeDefFromGraphQLNamedType(returnType),
    },
  }
}
