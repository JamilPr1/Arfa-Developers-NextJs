'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useArfa } from '@/hooks/arfa/useArfa'

type ArfaContextValue = ReturnType<typeof useArfa>

const ArfaContext = createContext<ArfaContextValue | null>(null)

export function ArfaProvider({ children }: { children: ReactNode }) {
  const value = useArfa()
  return <ArfaContext.Provider value={value}>{children}</ArfaContext.Provider>
}

export function useArfaContext(): ArfaContextValue {
  const ctx = useContext(ArfaContext)
  if (!ctx) throw new Error('useArfaContext must be used within ArfaProvider')
  return ctx
}
