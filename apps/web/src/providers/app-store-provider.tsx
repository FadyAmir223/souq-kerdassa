'use client'

import type { AppStore } from '@repo/store/types'
import { createAppStore } from '@repo/store/web'
import type { ReactNode } from 'react'
import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type AppStoreApi = ReturnType<typeof createAppStore>

const AppStoreContext = createContext<AppStoreApi | undefined>(undefined)

type AppStoreProviderProps = {
  children: ReactNode
}

export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
  const storeRef = useRef<AppStoreApi>()

  if (!storeRef.current) storeRef.current = createAppStore()

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  )
}

export const useAppStore = <T,>(selector: (store: AppStore) => T): T => {
  const api = useContext(AppStoreContext)

  if (!api) throw new Error(`useAppStore must be used within AppStoreProvider`)

  return useStore(api, selector)
}

export const useMainStore = <T,>(
  selector: (store: AppStore) => T,
): [T, AppStore] => {
  const api = useContext(AppStoreContext)

  if (!api) throw new Error(`useAppStore must be used within AppStoreProvider`)

  const store = useStore(api, selector)
  // @ts-expect-error un-existing type
  return [store, api]
}
