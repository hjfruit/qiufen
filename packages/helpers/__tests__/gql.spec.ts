import { readFileSync } from 'fs'
import { URL, fileURLToPath } from 'url'
import { OperationTypeNode, buildSchema } from 'graphql'
import {
  getOperationsBySchema,
  groupOperations,
  normalizeGraphqlField,
  genArgsExample,
  genOutputExample,
} from '../src/operation'
import { genSpace, genGQLStr, genGQLStrInGroup } from '../src/gql'

/********** genSpace start **********/
describe('genSpace', () => {
  it('a string consisting of a given number of spaces should be generated', () => {
    expect(genSpace(0)).toBe('')
    expect(genSpace(10)).toBe(' '.repeat(10))
  })
})
/********** genSpace end ************/

/********** genGQLStr start **********/
const schemaPath = fileURLToPath(new URL('./schema.graphql', import.meta.url))
const schemaString = readFileSync(schemaPath, {
  encoding: 'utf-8',
})
const schema = buildSchema(schemaString)
const allOperations = getOperationsBySchema(schema)
const operationsAfterBeingGrouped = groupOperations(allOperations)

describe('genGQLStr', () => {
  const fieldsMap = {
    [OperationTypeNode.QUERY]: schema.getQueryType()?.getFields() || {},
    [OperationTypeNode.MUTATION]: schema.getMutationType()?.getFields() || {},
    [OperationTypeNode.SUBSCRIPTION]:
      schema.getSubscriptionType()?.getFields() || {},
  }
  Object.entries(fieldsMap).forEach(([operationType, graphQLFields]) => {
    Object.values(graphQLFields).forEach(graphQLField => {
      it(`a gql string for ${graphQLField.name} ${operationType} should be generated`, () => {
        const operation = normalizeGraphqlField(graphQLField, {})
        const gqlString = genGQLStr({
          operationType: operationType as OperationTypeNode,
          ...operation,
        })
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

/********** genExampleValue start ************/
describe('genExampleValue', () => {
  allOperations.forEach(operation => {
    it(`a arguments example for the operation ${operation.name} ${operation.operationType} should be generated`, () => {
      expect(genArgsExample(operation.args, {})).toMatchSnapshot()
    })
    it(`a return data example for the operation ${operation.name} ${operation.operationType} should be generated`, () => {
      expect(genOutputExample(operation.output, {})).toMatchSnapshot()
    })
  })
})
/********** genExampleValue end **************/
