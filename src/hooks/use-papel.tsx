import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

// Org única da Fase 1 (bootstrap F1-T06). Quando houver multi-org,
// isso vira seleção de organização no login (adapta-divida abaixo).
// adapta-divida: org fixa em constante; seletor de organização quando houver >1 org ativa
export const ORG_ID = '00000000-0000-0000-0000-000000000001'

export type Papel = 'admin' | 'lider_comercial' | 'prospector' | 'vendedor' | 'leitor'

// RN-144: a navegação e os controles seguem a matriz M1–M5 (SPEC-1-001).
// A ocultação na UI é a PRIMEIRA camada — a RLS nega server-side (CA-1-09).
export const PODE: Record<
  Papel,
  {
    contas: boolean
    contatos: boolean
    corrigir: boolean
    importar: boolean
    painel: boolean
    usuarios: boolean
  }
> = {
  admin: {
    contas: true,
    contatos: false,
    corrigir: false,
    importar: false,
    painel: true,
    usuarios: true,
  },
  lider_comercial: {
    contas: true,
    contatos: true,
    corrigir: true,
    importar: false,
    painel: true,
    usuarios: false,
  },
  prospector: {
    contas: true,
    contatos: true,
    corrigir: true,
    importar: true,
    painel: true,
    usuarios: false,
  },
  vendedor: {
    contas: true,
    contatos: false,
    corrigir: false,
    importar: false,
    painel: true,
    usuarios: false,
  },
  leitor: {
    contas: true,
    contatos: false,
    corrigir: false,
    importar: false,
    painel: true,
    usuarios: false,
  },
}

interface RoleContextType {
  papel: Papel | null
  loading: boolean
  pode: (typeof PODE)[Papel] | null
  refetch: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const usePapel = () => {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('usePapel must be used within a PapelProvider')
  }
  return context
}

export const PapelProvider = ({ children }: { children: ReactNode }) => {
  const { user, session } = useAuth()
  const [papel, setPapel] = useState<Papel | null>(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    if (!user || !session) {
      setPapel(null)
      setLoading(false)
      return
    }
    setLoading(true)
    supabase.rpc('my_role', { p_org: ORG_ID }).then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        console.error('my_role falhou:', error.message)
        setPapel(null)
      } else {
        setPapel((data as Papel) ?? null)
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [user, session, tick])

  return (
    <RoleContext.Provider value={{ papel, loading, pode: papel ? PODE[papel] : null, refetch }}>
      {children}
    </RoleContext.Provider>
  )
}

// RN-142/RN-144: tela/dado fora do papel não renderiza (a API continua negando).
export const SemPermissao = ({ papel }: { papel: Papel | null }) => (
  <div className="min-h-[60vh] flex items-center justify-center p-4">
    <div className="max-w-md text-center p-8 rounded-[16px] bg-[#1A1F29] border border-[#2A3242]">
      <p className="text-[#FF6B6B] font-semibold mb-2">Acesso não autorizado</p>
      <p className="text-sm text-[#8899B3] leading-relaxed">
        Seu papel{papel ? ` (${papel})` : ''} não tem permissão para esta tela, conforme a matriz de
        permissões do sistema.
      </p>
    </div>
  </div>
)
