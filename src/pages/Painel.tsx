import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { usePapel, SemPermissao } from '@/hooks/use-papel'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'

// RN-141: indicador exibe valor, janela e cobertura.
// CA-1-11: painel diferencia zero, dado ausente e dado incompleto.
type Indicador = {
  chave: string
  titulo: string
  valor: number | null // null = dado AUSENTE (não confundir com zero)
  incompleto: number | null // dado INCOMPLETO (ex.: sem CNPJ)
  cobertura: string
  janela: string
}

export default function Painel() {
  const { papel, pode, loading: papelLoading } = usePapel()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inds, setInds] = useState<Indicador[]>([])
  const [origem, setOrigem] = useState<'todas' | 'kommo' | 'fora_de_escopo'>('todas')

  const carregar = async () => {
    setLoading(true)
    setError(null)
    let q = supabase.from('accounts').select('id, status, source, cnpj')
    if (origem !== 'todas') q = q.eq('source', origem)
    const { data, error: err } = await q
    if (err) {
      setError(err.message)
      setInds([])
      setLoading(false)
      return
    }
    const rows =
      (data as { id: string; status: string; source: string | null; cnpj: string | null }[]) ?? []
    const total = rows.length
    const naoReconc = rows.filter((r) => r.status === 'importado_nao_reconciliado').length
    const semCnpj = rows.filter((r) => !r.cnpj).length
    const ativos = rows.filter((r) => r.status === 'ativo').length
    setInds([
      {
        chave: 'total',
        titulo: 'Contas na base',
        valor: total,
        incompleto: null,
        cobertura: total > 0 ? '100% da base' : 'sem base',
        janela: 'acumulado · origem: ' + (origem === 'todas' ? 'todas' : origem),
      },
      {
        chave: 'reconciliar',
        titulo: 'Aguardando reconciliação',
        valor: naoReconc,
        incompleto: null,
        cobertura: total > 0 ? `${Math.round((naoReconc / total) * 100)}% da base` : 'sem base',
        janela: 'acumulado · origem: ' + (origem === 'todas' ? 'todas' : origem),
      },
      {
        chave: 'sem_cnpj',
        titulo: 'Sem CNPJ (incompleto)',
        valor: semCnpj,
        incompleto: semCnpj,
        cobertura: total > 0 ? `${Math.round((semCnpj / total) * 100)}% sem dado` : 'sem base',
        janela: 'acumulado · origem: ' + (origem === 'todas' ? 'todas' : origem),
      },
      {
        chave: 'ativos',
        titulo: 'Contas ativas',
        valor: ativos,
        incompleto: null,
        cobertura: total > 0 ? `${Math.round((ativos / total) * 100)}% da base` : 'sem base',
        janela: 'acumulado · origem: ' + (origem === 'todas' ? 'todas' : origem),
      },
    ])
    setLoading(false)
  }

  useEffect(() => {
    if (!papelLoading && pode?.painel) carregar()
  }, [papelLoading, pode?.painel, origem])

  if (papelLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00D4FF] animate-spin" />
      </div>
    )
  }
  if (!pode?.painel) return <SemPermissao papel={papel} />

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[#E8ECF4]">Painel inicial</h1>
          <p className="text-sm text-[#8899B3] mt-1">
            Indicadores com valor, janela e cobertura (RN-141) · zero ≠ ausente ≠ incompleto
            (CA-1-11)
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={origem}
            onChange={(e) => setOrigem(e.target.value as typeof origem)}
            className="px-4 py-2.5 bg-[#12161F] text-[#E8ECF4] text-sm rounded-[10px] border border-[#252D3D] focus:border-[#00D4FF] outline-none"
            aria-label="Filtrar por origem"
          >
            <option value="todas">Todas as origens</option>
            <option value="kommo">Kommo</option>
            <option value="fora_de_escopo">Fora de escopo</option>
          </select>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-[12px] bg-[#1A1F29] border border-[#252D3D] animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-[12px] bg-[#2A1215] border border-[#FF6B6B]/40 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#FF6B6B] shrink-0 mt-0.5" />
          <div>
            <p className="text-[#FF6B6B] font-semibold text-sm">Erro ao carregar indicadores</p>
            <p className="text-xs text-[#8899B3] mt-1">{error}</p>
            <button onClick={carregar} className="mt-3 text-xs text-[#00D4FF] hover:underline">
              Tentar novamente
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {inds.map((ind) => (
            <div
              key={ind.chave}
              className="p-5 rounded-[12px] bg-[#1A1F29] border border-[#252D3D]"
            >
              <p className="text-xs text-[#8899B3] uppercase tracking-wider font-medium">
                {ind.titulo}
              </p>
              {/* CA-1-11: zero é valor válido; ausente é "—" com explicação; incompleto tem destaque */}
              {ind.valor === null ? (
                <p
                  className="text-3xl font-semibold text-[#8899B3] mt-2"
                  title="Dado ausente — não é zero"
                >
                  —
                </p>
              ) : (
                <p className="text-3xl font-semibold text-[#E8ECF4] mt-2">
                  {ind.valor.toLocaleString('pt-BR')}
                </p>
              )}
              {ind.incompleto !== null && ind.incompleto > 0 && (
                <p className="text-xs text-amber-400 mt-1">
                  {ind.incompleto} registros incompletos
                </p>
              )}
              <div className="mt-3 pt-3 border-t border-[#252D3D]/60 space-y-1">
                <p className="text-[11px] text-[#8899B3]">Cobertura: {ind.cobertura}</p>
                <p className="text-[11px] text-[#8899B3]">Janela: {ind.janela}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
