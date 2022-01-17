import { readFileSync } from 'fs'
import path from 'path'
import { buildSchema, OperationTypeNode } from 'graphql'
import { genSpace, genGQLStr, genGQLStrInGroup, genVariables } from '../src/gql'
import { getOperationsBySchema } from '../src/operation'

test('genSpace', () => {
  expect(genSpace(0)).toBe('')
  expect(genSpace(10)).toBe('          ')
})

const schemaPath = path.join(__dirname, './schema.graphql')
const schemaString = readFileSync(schemaPath, {
  encoding: 'utf-8',
})
const schema = buildSchema(schemaString)

test('genGQLStr', () => {
  const userQuery = schema.getQueryType()?.getFields().user
  console.log(genGQLStr(OperationTypeNode.QUERY, userQuery))
})

test('genGQLStrInGroup', () => {})

test('genVariables', () => {})
