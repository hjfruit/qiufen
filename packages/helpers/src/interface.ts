import type { ConstDirectiveNode, OperationTypeNode } from 'graphql'

export type Directive = ConstDirectiveNode

export type Directives = ReadonlyArray<Directive>

export type EnumTypeDef = {
  name: string
  description: string
  directives: Directives
  value: unknown
}[]

export type FieldTypeDef = {
  description: string
  directives: Directives
  type: string
  typeDef: TypeDef
}

export type UnionTypeDef = Record<string, FieldTypeDef>

export type TypeDef = EnumTypeDef | UnionTypeDef | undefined

export interface OperationArgument extends FieldTypeDef {
  name: string
}

export interface OperationReturn extends FieldTypeDef {
  name: string
}

export interface Operation {
  name: string
  description: string
  directives: Directives
  arguments: OperationArgument[]
  argumentsExample: Record<string, unknown>
  return: OperationReturn
  returnExample: Record<string, unknown>
}

export interface TypedOperation extends Operation {
  type: OperationTypeNode
}

export type ScalarMap = Record<string, unknown>
