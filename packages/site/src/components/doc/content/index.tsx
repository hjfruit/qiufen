import React, { useMemo } from 'react'
import OperationDoc from './operation-doc'
import type { TypedOperation } from '@graphql-kit/helpers'
import type { FC } from 'react'

interface IProps {
  operation?: TypedOperation
}

const DocContent: FC<IProps> = ({ operation }) => {
  const contentJSX = useMemo(() => {
    if (!operation) return null
    return <OperationDoc operation={operation} />
  }, [operation])

  return contentJSX
}

export default DocContent
