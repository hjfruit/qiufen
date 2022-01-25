import create from 'zustand'
import type { TypedOperation } from '@graphql-kit/helpers'

interface OperationStoreState {
  operations?: TypedOperation[]
  mounted?: boolean
  error?: Error | null
  keyword?: string
  selectedOperation?: TypedOperation
}

interface OperationStoreAction {
  updateState: (state: OperationStoreState) => void
}

export const name = 'host-store'

const useDocStore = create<OperationStoreState & OperationStoreAction>(set => {
  return {
    updateState: state => {
      set(state)
    },
  }
})

export default useDocStore
