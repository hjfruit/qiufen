import { ConstDirectiveNode } from 'graphql'

export type Directives = ReadonlyArray<ConstDirectiveNode>

export type EnumTypeDef = {
  name: string
  description: string
  directives: Directives
  value: unknown
}[]

export type FieldTypeDef = {
  description: string
  type: string
  directives: Directives
  typeDef: TypeDef
}

export type UnionTypeDef = Record<string, FieldTypeDef>

export type TypeDef = EnumTypeDef | UnionTypeDef | undefined

export interface OperationArgument {
  name: string
  description: string
  directives: Directives
  type: string
  typeDef: TypeDef
}

export interface OperationReturn {
  name: string
  description: string
  directives: Directives
  type: string
  typeDef: TypeDef
}

export interface Operation {
  name: string
  description: string
  directives: Directives
  arguments: OperationArgument[]
  return: OperationReturn
}
