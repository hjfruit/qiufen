import vm from 'vm'
import { mapSchema, MapperKind } from '@graphql-tools/utils'
import {
  getNullableType,
  GraphQLError,
  GraphQLInterfaceType,
  GraphQLUnionType,
  isAbstractType,
  isEnumType,
  isListType,
  isObjectType,
  isScalarType,
  isUnionType,
  Kind,
  defaultFieldResolver,
} from 'graphql'
import { addResolversToSchema } from '@graphql-tools/schema'
import { merge, isObject } from 'lodash'
import type { IResolvers } from '@graphql-tools/utils'
import type {
  GraphQLSchema,
  GraphQLFieldResolver,
  GraphQLOutputType,
  IntValueNode,
  ArgumentNode,
  BooleanValueNode,
  ObjectValueNode,
  StringValueNode,
  GraphQLResolveInfo,
} from 'graphql'
import type { ScalarMap } from '@/../helpers/dist/types'

interface IOptions {
  schema: GraphQLSchema
  scalarMap?: ScalarMap
  resolvers?: IResolvers
  preserveResolvers?: boolean
  globalContext?: Record<any, any>
}

// interpret string
function interpret(templateStr: string, context: Record<string, any>) {
  const match = templateStr.match(/^%{(.*?)}$/)
  if (match && match[1]) {
    return vm.runInNewContext(match[1], context)
  }
  return templateStr
}

// get a number in range [0, total)
function takeRandom(total: number) {
  return Math.floor(Math.random() * total)
}

export function addMocksToSchema({
  schema,
  scalarMap,
  resolvers,
  globalContext = {},
}: IOptions): GraphQLSchema {
  const mockResolver: GraphQLFieldResolver<unknown, any> = (
    source,
    args,
    context,
    info,
  ) => {
    const variables = context.body.variables
    const mockDirective = info.fieldNodes[0].directives?.find(
      item => item.name.value === 'mock',
    )
    const mockErr = mockDirective?.arguments?.find(
      item => item.name.value === 'err',
    )
    if (mockErr) {
      const errFields = (mockErr.value as ObjectValueNode).fields
      const code = (
        errFields.find(item => item.name.value === 'code')
          ?.value as IntValueNode
      ).value
      const message = (
        errFields.find(item => item.name.value === 'message')
          ?.value as StringValueNode
      ).value
      throw new GraphQLError(message, { extensions: { code, message } })
    }

    const mockVal = mockDirective?.arguments?.find(
      item => item.name.value === 'val',
    )
    const mockLen = mockDirective?.arguments?.find(
      item => item.name.value === 'len',
    )
    const mockFallback = (
      mockDirective?.arguments?.find(item => item.name.value === 'fallback')
        ?.value as BooleanValueNode
    ).value

    const genMockVal = (
      val: ArgumentNode,
      path: GraphQLResolveInfo['path'],
    ) => {
      switch (val.value.kind) {
        case Kind.FLOAT:
        case Kind.INT:
          return Number(val?.value.value)
        case Kind.BOOLEAN:
          return val?.value.value
        case Kind.STRING:
          return interpret(
            val?.value.value,
            Object.assign({ ...globalContext }, variables, { path }),
          )
        case Kind.NULL:
          return null
        default:
          throw new Error('@mock error: invalid val data type')
      }
    }
    const mockScalar = (typeName: string, path: GraphQLResolveInfo['path']) => {
      if (mockVal) {
        try {
          return genMockVal(mockVal, path)
        } catch (err) {
          if (!mockFallback) {
            throw err
          }
        }
      }
      const mock = scalarMap?.[typeName]
      return typeof mock === 'function' ? mock() : mock
    }

    const mockData = (
      type: GraphQLOutputType,
      path: GraphQLResolveInfo['path'],
      len = 2,
    ): unknown => {
      const nullableType = getNullableType(type)

      if (isScalarType(nullableType)) {
        return mockScalar(nullableType.name, path)
      }
      if (isEnumType(nullableType)) {
        const values = nullableType.getValues()
        if (mockVal) {
          const value = genMockVal(mockVal, path)
          if (values.some(item => item.value === value) || !mockFallback) {
            return value
          }
        }
        return values[takeRandom(values.length)].value
      }
      if (isListType(nullableType)) {
        return [...new Array(+len)].map((_, index) => {
          return mockData(nullableType.ofType, {
            prev: path,
            key: index,
            typename: path.typename,
          })
        })
      }
      if (isAbstractType(nullableType)) {
        const types = schema.getPossibleTypes(nullableType)
        const randomType = types[takeRandom(types.length)]
        return mockData(randomType, {
          ...path,
          typename: randomType.name,
        })
      }
      if (isObjectType(nullableType)) {
        return { $ref: nullableType.name }
      }
      throw new Error(`${nullableType} not implemented`)
    }

    const len = mockLen?.value
      ? +interpret((mockLen?.value as IntValueNode | StringValueNode).value, {
          ...globalContext,
          ...variables,
          path: info.path,
        })
      : 2
    return mockData(info.returnType, info.path, len)
  }

  const typeResolver = (data: unknown) => {
    if (typeof data === 'object' && data && '$ref' in data) {
      return (data as { $ref: string })['$ref']
    }
    return
  }

  const schemaWithMocks = mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: ({ ...fieldConfig }) => {
      fieldConfig.resolve = async (source, args, context, info) => {
        const [mockedValue, resolvedValue] = await Promise.all([
          mockResolver(source, args, context, info),
          defaultFieldResolver(source, args, context, info),
        ])
        if (mockedValue instanceof Error) {
          if (!resolvedValue) {
            return mockedValue
          }
          return resolvedValue
        }
        if (isObject(mockedValue)) {
          return merge(mockedValue, resolvedValue)
        }
        return resolvedValue === undefined ? mockedValue : resolvedValue
      }

      return fieldConfig
    },
    [MapperKind.ABSTRACT_TYPE]: type => {
      if (type.resolveType != null && type.resolveType.length) {
        return
      }
      if (isUnionType(type)) {
        return new GraphQLUnionType({
          ...type.toConfig(),
          resolveType: typeResolver,
        })
      } else {
        return new GraphQLInterfaceType({
          ...type.toConfig(),
          resolveType: typeResolver,
        })
      }
    },
  })

  return resolvers
    ? addResolversToSchema({
        schema: schemaWithMocks,
        resolvers,
      })
    : schemaWithMocks
}
