import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'
import { usePapel, SemPermissao } from '@/hooks/use-papel'
import { Loader2, AlertCircle, RefreshCw, Database, Users, Inbox } from 'lucide-react'

type Account = Tables<'accounts'>

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  importado_nao_reconciliado: {
    label: 'Importado · não reconciliado',
    cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  ativo: { label: 'Ativo', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  pesquisa_necessaria: {
    label: 'Pesquisa necessária',
    cls: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
  desqualificado: {
    label: 'Desqualificado',
    cls: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  },
  arquivado: { label: 'Arquivado', cls: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
}

export default function Contas() {
  const { papel, pode, loading: papelLoading } = usePapel()
  const [contas, setContas] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  const carregar = async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('accounts')
      .select('id, name, cnpj, status, source, sector, region, site, updated_at')
      .order('name')
      .limit(200)
    if (err) {
      setError(err.message)
      setContas([])
    } else {
      setContas((data as Account[]) ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!papelLoading && pode?.contas) carregar()
  }, [papelLoading, pode?.contas])

  if (papelLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00D4FF] animate-spin" />
      </div>
    )
  }
  if (!pode?.contas) return <SemPermissao papel={papel} />

  const filtradas = contas.filter((c) => c.name.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[#E8ECF4]">Contas</h1>
          <p className="text-sm text-[#8899B3] mt-1">
            {contas.length} contas na base · origem visível em cada linha
          </p>
        </div>
        <div className="flex gap-2">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar conta..."
            className="px-4 py-2.5 bg-[#12161F] text-[#E8ECF4] placeholder:text-[#8899B3]/50 text-sm rounded-[10px] border border-[#252D3D] focus:border-[#00D4FF] outline-none w-56"
          />
          <button
            onClick={carregar}
            className="p-2.5 rounded-[10px] bg-[#12161F] border border-[#252D3D] text-[#8899B3] hover:text-[#00D4FF] transition-colors"
            aria-label="Recarregar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-[10px] bg-[#1A1F29] border border-[#252D3D] animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-[12px] bg-[#2A1215] border border-[#FF6B6B]/40 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#FF6B6B] shrink-0 mt-0.5" />
          <div>
            <p className="text-[#FF6B6B] font-semibold text-sm">Erro ao carregar contas</p>
            <p className="text-xs text-[#8899B3] mt-1">{error}</p>
            <button onClick={carregar} className="mt-3 text-xs text-[#00D4FF] hover:underline">
              Tentar novamente
            </button>
          </div>
        </div>
      ) : contas.length === 0 ? (
        <div className="p-10 rounded-[12px] bg-[#1A1F29] border border-[#252D3D] text-center">
          <Database className="w-10 h-10 text-[#8899B3] mx-auto mb-3" />
          <p className="text-[#E8ECF4] font-medium">Nenhuma conta na base</p>
          <p className="text-sm text-[#8899B3] mt-1">
            Importe a base comercial para começar a prospecção.
          </p>
        </div>
      ) : (
        <div className="rounded-[12px] border border-[#252D3D] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#12161F] text-left text-xs text-[#8899B3] uppercase tracking-wider">
                <th className="px-4 py-3">Conta</th>
                <th className="px-4 py-3 hidden md:table-cell">Status</th>
                <th className="px-4 py-3 hidden sm:table-cell">Origem</th>
                <th className="px-4 py-3 hidden lg:table-cell">Região</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((c) => {
                const st = STATUS_LABEL[c.status] ?? {
                  label: c.status,
                  cls: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
                }
                return (
                  <tr
                    key={c.id}
                    className="border-t border-[#252D3D] hover:bg-[#12161F]/60 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-[#E8ECF4] font-medium truncate max-w-[280px]">{c.name}</p>
                      {c.site && (
                        <p className="text-xs text-[#8899B3] truncate max-w-[280px]">{c.site}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`px-2.5 py-1 rounded-md border text-xs ${st.cls}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-[#8899B3] text-xs">
                      {c.source === 'fora_de_escopo'
                        ? 'Fora de escopo'
                        : c.source === 'kommo'
                          ? 'Kommo'
                          : (c.source ?? '—')}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-[#8899B3] text-xs">
                      {c.region || '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtradas.length === 0 && (
            <div className="p-8 text-center text-[#8899B3] text-sm border-t border-[#252D3D]">
              <Inbox className="w-6 h-6 mx-auto mb-2" />
              Nenhuma conta corresponde à busca "{busca}"
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex gap-3 text-sm">
        {pode?.corrigir && (
          <Link
            to="/correcoes"
            className="px-4 py-2.5 rounded-[10px] bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] hover:bg-[#00D4FF]/20 transition-colors"
          >
            <Users className="w-4 h-4 inline mr-2" />
            Fila de correção
          </Link>
        )}
        <Link
          to="/painel"
          className="px-4 py-2.5 rounded-[10px] bg-[#12161F] border border-[#252D3D] text-[#8899B3] hover:text-[#E8ECF4] transition-colors"
        >
          Ver painel
        </Link>
      </div>
    </div>
  )
}
