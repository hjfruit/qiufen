import type {
  GraphQLArgument,
  GraphQLEnumValue,
  GraphQLField,
  OperationTypeNode,
} from 'graphql'

export interface BaseTypeDef {
  name: string
  ofName: string
}

export interface ScalarTypeDef extends BaseTypeDef {
  kind: 'Scalar'
}

export type EnumValueTypeDef = Pick<
  GraphQLEnumValue,
  'name' | 'description' | 'value' | 'deprecationReason'
>

export interface EnumTypeDef extends BaseTypeDef {
  kind: 'Enum'
  values: EnumValueTypeDef[]
}

export interface ObjectTypeDef extends BaseTypeDef {
  kind: 'Object'
  fields: ObjectFieldTypeDef[]
}

export interface UnionTypeDef extends BaseTypeDef {
  kind: 'Union'
  types: ObjectTypeDef[]
}

export interface InputObjectTypeDef extends BaseTypeDef {
  kind: 'InputObject'
  fields: ArgTypeDef[]
}

export type OutputType =
  | ScalarTypeDef
  | EnumTypeDef
  | ObjectTypeDef
  | UnionTypeDef

export type InputType = ScalarTypeDef | EnumTypeDef | InputObjectTypeDef

export interface ArgTypeDef
  extends Pick<
    GraphQLArgument,
    'name' | 'description' | 'defaultValue' | 'deprecationReason'
  > {
  type: InputType
}

export interface ObjectFieldTypeDef
  extends Pick<
    GraphQLField<unknown, unknown>,
    'name' | 'description' | 'deprecationReason'
  > {
  args: ArgTypeDef[]
  output: OutputType
}

export interface Operation extends ObjectFieldTypeDef {
  argsExample: Record<string, unknown>
  outputExample: Record<string, unknown>
}

export interface TypedOperation extends Operation {
  operationType: OperationTypeNode
}

export type ScalarMap = Record<string, unknown>
