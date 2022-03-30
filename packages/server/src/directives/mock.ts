import { mapSchema, MapperKind } from '@graphql-tools/utils'
import { isEnumType, isListType, isScalarType, Kind } from 'graphql'
import { addResolversToSchema } from '@graphql-tools/schema'
import get from 'lodash.get'
import type { IResolvers } from '@graphql-tools/utils'
import type {
  GraphQLSchema,
  GraphQLFieldResolver,
  GraphQLOutputType,
  IntValueNode,
} from 'graphql'
import type { ScalarMap } from '@/../helpers/dist/types'

interface IOptions {
  schema: GraphQLSchema
  scalarMap?: ScalarMap
  resolvers?: IResolvers
  preserveResolvers?: boolean
}

function isObject(thing: unknown) {
  return thing === Object(thing) && !Array.isArray(thing)
}

function copyOwnPropsIfNotPresent(target: object, source: unknown) {
  for (const prop of Object.getOwnPropertyNames(source)) {
    if (!Object.getOwnPropertyDescriptor(target, prop)) {
      const propertyDescriptor = Object.getOwnPropertyDescriptor(source, prop)
      Object.defineProperty(
        target,
        prop,
        propertyDescriptor == null ? {} : propertyDescriptor,
      )
    }
  }
}

function copyOwnProps(target: object, ...sources: unknown[]) {
  for (const source of sources) {
    let chain = source
    while (chain != null) {
      copyOwnPropsIfNotPresent(target, chain)
      chain = Object.getPrototypeOf(chain)
    }
  }
  return target
}

function interpret(
  templateStr: string,
  context: Record<string, any> & { index: number[] },
) {
  return templateStr.replace(/\${(.*?)}/g, (source, prop) => {
    if (prop === 'index') {
      prop = `index.${context.index.length - 1}`
    }
    const contextValue = get(context, prop)
    return contextValue !== undefined ? contextValue : source
  })
}

export function addMocksToSchema({
  schema,
  scalarMap,
  resolvers,
  preserveResolvers = true,
}: IOptions): GraphQLSchema {
  const mockResolver: GraphQLFieldResolver<unknown, any> = (
    source,
    args,
    context,
    info,
  ) => {
    const mockDirective = info.fieldNodes[0].directives?.find(
      item => item.name.value === 'mock',
    )
    const mockVal = mockDirective?.arguments?.find(
      item => item.name.value === 'val',
    )
    const mockLen = mockDirective?.arguments?.find(
      item => item.name.value === 'len',
    )

    const mockScalar = (typeName: string, listPath: number[]) => {
      if (mockVal) {
        switch (mockVal.value.kind) {
          case Kind.FLOAT:
          case Kind.INT:
            return Number(mockVal?.value.value)
          case Kind.BOOLEAN:
            return mockVal?.value.value
          case Kind.STRING:
            return interpret(
              mockVal?.value.value,
              Object.assign({}, context.body.variables, { index: listPath }),
            )
          case Kind.NULL:
            return null
          default:
            throw new Error('@mock error: invalid val data type')
        }
      }
      const mock = scalarMap?.[typeName]
      return typeof mock === 'function' ? mock() : mock
    }

    const mockData = (
      type: GraphQLOutputType,
      listPath: number[],
      len = 2,
    ): unknown => {
      if (isScalarType(type)) {
        if (mockVal) {
          return mockScalar(type.name, listPath)
        }
        const mock = scalarMap?.[type.name]
        return typeof mock === 'function' ? mock() : mock
      }
      if (isEnumType(type)) {
        return type.getValues()[0].value
      }
      if (isListType(type)) {
        return [...new Array(+len)].map((_, index) => {
          return mockData(type.ofType, [...listPath, index])
        })
      }
      return {}
    }

    const len = mockLen?.value ? +(mockLen?.value as IntValueNode).value : 2
    let path: undefined | typeof info.path = info.path
    const pathList: number[] = []
    while (path) {
      if (typeof path.key === 'number') {
        pathList.unshift(path.key)
      }
      path = path.prev
    }
    return mockData(info.returnType, pathList, len)
  }

  const schemaWithMocks = mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: ({ ...fieldConfig }) => {
      const { resolve: oldResolver } = fieldConfig

      if (!preserveResolvers || !oldResolver) {
        fieldConfig.resolve = mockResolver
      } else {
        fieldConfig.resolve = async (source, args, context, info) => {
          const [mockedValue, resolvedValue] = await Promise.all([
            mockResolver(source, args, context, info),
            oldResolver(source, args, context, info),
          ])

          if (mockedValue instanceof Error) {
            if (!resolvedValue) {
              return mockedValue
            }
            return resolvedValue
          }

          if (isObject(mockedValue) && isObject(resolvedValue)) {
            const emptyObject = Object.create(
              Object.getPrototypeOf(resolvedValue),
            )
            return copyOwnProps(emptyObject, resolvedValue, mockedValue)
          }

          return undefined !== resolvedValue ? resolvedValue : mockedValue
        }
      }

      return {
        ...fieldConfig,
      }
    },
  })

  return resolvers
    ? addResolversToSchema(schemaWithMocks, resolvers)
    : schemaWithMocks
}
