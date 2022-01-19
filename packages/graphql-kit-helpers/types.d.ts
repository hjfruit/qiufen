import type {
  OperationTypeNode,
  ConstDirectiveNode,
  GraphQLField,
  GraphQLSchema,
} from 'graphql'

export declare type Directive = ConstDirectiveNode

export declare type Directives = ReadonlyArray<Directive>

export declare type EnumTypeDef = {
  name: string
  description: string
  directives: Directives
  value: unknown
}[]

export declare type FieldTypeDef = {
  description: string
  directives: Directives
  type: string
  typeDef: TypeDef
}

/**
 * generate a gql string
 * @param operationType - the type of operation
 * @param operation - operation which need to be converted into a gql
 * @param indent - the indent of gql
 */
export declare const genGQLStr: (
  operationType: OperationTypeNode,
  operation: Operation,
  indent?: number,
) => string

/**
 * generate a group of gqls
 * @param groupName - the name of group
 * @param operations - the operations in a group
 */
export declare const genGQLStrInGroup: (
  groupName: string,
  operations: TypedOperation[],
) => string

/**
 * generate a space string
 * @param count - the str length
 */
export declare const genSpace: (count: number) => string

/**
 * generate a variables object
 * @param args - the arguments of operation
 * @param scalarMap - a map contains the default value of scalar type
 */
export declare const genVariables: (
  args: OperationArgument[],
  scalarMap: ScalarMap,
) => Record<string, unknown>

/**
 * TODO:handle circular ref
 * get operation info from a GraphQLField instance
 * @param graphQLField - GraphQLField instance from which should be extracted
 * @param schema - GraphQLSchema instance
 */
export declare function getOperationFromGraphQLField(
  graphQLField: GraphQLField<unknown, unknown>,
  schema: GraphQLSchema,
): Operation

/**
 * get all operations by schema
 * @param schema - GraphqlSchema instance
 */
export declare function getOperationsBySchema(
  schema: GraphQLSchema,
): TypedOperation[]

/**
 * grouping logic
 * @param operation - the operation need to be grouped
 */
export declare function group(operation: TypedOperation): {
  groupName: string
  operation: {
    description: string
    type: OperationTypeNode
    name: string
    directives: Directives
    arguments: OperationArgument[]
    return: OperationReturn
  }
}

/**
 * separate operations into some groups
 * @param operations - the operations need to be grouped
 * @param groupFn - the grouping logic function
 */
export declare function groupOperations(
  operations: TypedOperation[],
  groupFn?: typeof group,
): Record<string, TypedOperation[]>

export declare interface Operation {
  name: string
  description: string
  directives: Directives
  arguments: OperationArgument[]
  return: OperationReturn
}

export declare interface OperationArgument extends FieldTypeDef {
  name: string
}

export declare interface OperationReturn extends FieldTypeDef {
  name: string
}

export declare type ScalarMap = Record<string, unknown>

export declare type TypeDef = EnumTypeDef | UnionTypeDef | undefined

export declare interface TypedOperation extends Operation {
  type: OperationTypeNode
}

export declare type UnionTypeDef = Record<string, FieldTypeDef>

export {}
