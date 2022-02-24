import create from 'zustand'
import type { TypedOperation } from '@fruits-chain/graphql-kit-helpers'

export enum NetworkStatus {
  /** request has not been sent */
  INITIAL,
  /** request is in in pending */
  PENDING,
  /** request is successful */
  SUCCESSFUL,
  /** request is failed */
  FAILED,
}
interface OperationStoreState {
  networkStatus: NetworkStatus
  operations: TypedOperation[]
  error: Error | null
  keyword: string
}

interface OperationStoreAction {
  updateState: (state: Partial<OperationStoreState>) => void
}

export const name = 'host-store'

const useDocStore = create<OperationStoreState & OperationStoreAction>(
  (set, get) => {
    return {
      networkStatus: NetworkStatus.INITIAL,
      operations: [],
      error: null,
      keyword: '',
      updateState: state => {
        set({ ...get(), ...state })
      },
    }
  },
)

export default useDocStore
