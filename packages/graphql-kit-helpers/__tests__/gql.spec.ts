import { readFileSync } from 'fs'
import { URL } from 'url'
import { buildSchema, OperationTypeNode } from 'graphql'
import { genSpace, genGQLStr, genGQLStrInGroup, genVariables } from '@src/gql'
import {
  getOperationFromGraphQLField,
  getOperationsBySchema,
  groupOperations,
} from '@src/operation'

/********** genSpace start **********/
describe('genSpace', () => {
  it('a string consisting of a given number of spaces should be generated', () => {
    expect(genSpace(0)).toBe('')
    expect(genSpace(10)).toBe(' '.repeat(10))
  })
})
/********** genSpace end ************/

/********** genGQLStr start **********/
const schemaPath = new URL('./schema.graphql', import.meta.url).pathname
const schemaString = readFileSync(schemaPath, {
  encoding: 'utf-8',
})
const schema = buildSchema(schemaString)
const allOperations = getOperationsBySchema(schema)
const operationsAfterBeingGrouped = groupOperations(allOperations)

describe('genGQLStr', () => {
  const fieldsMap = {
    query: schema.getQueryType()?.getFields() || {},
    mutation: schema.getMutationType()?.getFields() || {},
    subscription: schema.getSubscriptionType()?.getFields() || {},
  }
  Object.entries(fieldsMap).forEach(([operationType, graphQLFields]) => {
    Object.values(graphQLFields).forEach(graphQLField => {
      it(`a gql string for ${graphQLField.name} ${operationType} should be generated`, () => {
        const operation = getOperationFromGraphQLField(graphQLField, schema)
        const gqlString = genGQLStr(OperationTypeNode.QUERY, operation)
        expect(gqlString).toMatchSnapshot()
      })
    })
  })
})
/********** genGQLStr start ************/

/********** genGQLStrInGroup start ************/
describe('genGQLStrInGroup', () => {
  Object.entries(operationsAfterBeingGrouped).forEach(
    ([groupName, operations]) => {
      it(`gql strings for group ${groupName} should be generated`, () => {
        const gqlStrings = genGQLStrInGroup(groupName, operations)
        expect(gqlStrings).toMatchSnapshot()
      })
    },
  )
})
/********** genGQLStrInGroup end **************/

/********** genVariables start ************/
describe('genVariables', () => {
  allOperations.forEach(operation => {
    it(`a variable for the operation ${operation.name} ${operation.type} should be generated`, () => {
      expect(genVariables(operation.arguments, {})).toMatchSnapshot()
    })
  })
})
/********** genVariables end **************/
