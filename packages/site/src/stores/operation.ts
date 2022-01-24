import create from 'zustand'
import type { TypedOperation } from '@graphql-kit/helpers'

interface OperationStoreState {
  /** 文档数据 */
  operations?: TypedOperation[]
  ready?: boolean
  error?: Error | null
  /** 搜索keyword */
  keyword?: string
  /** 当前选中的接口 */
  selectedOperation?: TypedOperation
}

interface OperationStoreAction {
  /** 更新状态 */
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
