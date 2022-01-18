import { getNamedType, isEnumType, isScalarType, isUnionType } from "graphql"

/**
 * extract field info from field map
 * @param {import("graphql").GraphQLFieldMap<any, any> | import("graphql").GraphQLInputFieldMap} fieldMap - input definition node
 * @returns {any}
 */
export function extractFieldInfoFromFieldMap(fieldMap) {
  /** @type {Record<string, any>} */
  const result = {}
  Object.keys(fieldMap).forEach((key) => {
    const field = fieldMap[key]
    const namedType = getNamedType(field.type)
    result[key] = {
      description: field.description || '',
      type: field.type.toString(),
      directives: field.astNode?.directives,
      ...getTypeDefFromNamedType(namedType)
    }
  })
  return result
}

/**
 * extract field info from named type
 * @param {import("graphql").GraphQLNamedType} namedType - named type
 */
export function getTypeDefFromNamedType(namedType) {
  /** @type {Record<string, any>} */
  const result = {}
  if (isEnumType(namedType)) {
    result.typeDef = namedType.getValues().map(item => ({
      name: item.name,
      description: item.description || '',
      directives: item.astNode?.directives || [],
      value: item.value,
    }))
  } else if (isUnionType(namedType)) {
    result.typeDef = namedType.getTypes().map(item => {
      return extractFieldInfoFromFieldMap(item.getFields())
    }).reduce((result, item) => {
      return {...result, ...item}
    }, {})
  } else if (isScalarType(namedType)) {
    // Do nothing
  } else {
    result.typeDef = extractFieldInfoFromFieldMap(namedType.getFields())
  }
  return result
}

/**
 * extract operation info from graphql field
 * @param {import('graphql').GraphQLField<any, any>} graphQLField 
 * @param {import('graphql').GraphQLSchema} rawSchema 
 * @returns {object}
 * TODO:avoid circular ref
 */
 export function extractOperationInfoFromGraphQLField(graphQLField, rawSchema) {
  const typeMap = rawSchema.getTypeMap()
  const returnTypeValue = typeMap[getNamedType(graphQLField.type).name]
  return {
    name: graphQLField?.name,
    description: graphQLField?.description || '',
    directives: graphQLField.astNode?.directives || [],
    arguments: graphQLField?.args.map(item => {
      const namedType = getNamedType(item.type)
      const namedTypeValue = typeMap[namedType.name]
      return {
        name: item.name,
        description: item.description || '',
        directives: item.astNode?.directives || [],
        type: item.type.toString(),
        ...getTypeDefFromNamedType(namedTypeValue),
      }
    }),
    return: {
      name: graphQLField.name,
      directives: returnTypeValue.astNode?.directives,
      description: returnTypeValue.astNode?.description?.value || '',
      type: graphQLField?.type,
      ...getTypeDefFromNamedType(returnTypeValue),
    },
  }
}
