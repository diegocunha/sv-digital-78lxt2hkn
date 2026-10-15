import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'
import { usePapel, SemPermissao, ORG_ID } from '@/hooks/use-papel'
import { Loader2, AlertCircle, RefreshCw, CheckCircle2, Inbox } from 'lucide-react'

type Account = Tables<'accounts'>

// RN-143: registro incompleto aparece na fila de correção;
// importado não reconciliado fica separado.
export default function Correcoes() {
  const { papel, pode, loading: papelLoading, refetch } = usePapel()
  const [contas, setContas] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editando, setEditando] = useState<Account | null>(null)
  const [setor, setSetor] = useState('')
  const [regiao, setRegiao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  const carregar = async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('accounts')
      .select('*')
      .eq('status', 'importado_nao_reconciliado')
      .order('name')
      .limit(100)
    if (err) {
      setError(err.message)
      setContas([])
    } else {
      setContas((data as Account[]) ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!papelLoading && pode?.corrigir) carregar()
  }, [papelLoading, pode?.corrigir])

  if (papelLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00D4FF] animate-spin" />
      </div>
    )
  }
  if (!pode?.corrigir) return <SemPermissao papel={papel} />

  const abrirEdicao = (c: Account) => {
    setEditando(c)
    setSetor(c.sector ?? '')
    setRegiao(c.region ?? '')
    setErroForm(null)
    setSucesso(null)
  }

  const salvar = async () => {
    if (!editando) return
    if (!setor.trim()) {
      setErroForm('Informe o setor — campo obrigatório para reconciliar a conta.')
      return
    }
    setSalvando(true)
    setErroForm(null)
    // RN-121: reconciliar exige owner + próximo passo OU exceção justificada.
    // Correção simples aqui move para pesquisa_necessaria (owner/next_step viram
    // responsabilidade da reconciliação completa — fora do recorte da Fase 1).
    const { error: err } = await supabase
      .from('accounts')
      .update({
        sector: setor.trim(),
        region: regiao.trim() || null,
        status: 'pesquisa_necessaria',
      })
      .eq('id', editando.id)
    setSalvando(false)
    if (err) {
      setErroForm(err.message)
      return
    }
    setSucesso(`Conta "${editando.name}" movida para a fila de pesquisa.`)
    setEditando(null)
    refetch()
    carregar()
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[#E8ECF4]">Fila de correção</h1>
          <p className="text-sm text-[#8899B3] mt-1">
            {contas.length} contas importadas aguardando reconciliação
          </p>
        </div>
        <button
          onClick={carregar}
          className="p-2.5 rounded-[10px] bg-[#12161F] border border-[#252D3D] text-[#8899B3] hover:text-[#00D4FF] transition-colors"
          aria-label="Recarregar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {sucesso && (
        <div className="mb-4 p-3.5 rounded-[10px] bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm text-emerald-400">{sucesso}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
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
            <p className="text-[#FF6B6B] font-semibold text-sm">Erro ao carregar a fila</p>
            <p className="text-xs text-[#8899B3] mt-1">{error}</p>
            <button onClick={carregar} className="mt-3 text-xs text-[#00D4FF] hover:underline">
              Tentar novamente
            </button>
          </div>
        </div>
      ) : contas.length === 0 ? (
        <div className="p-10 rounded-[12px] bg-[#1A1F29] border border-[#252D3D] text-center">
          <Inbox className="w-10 h-10 text-[#8899B3] mx-auto mb-3" />
          <p className="text-[#E8ECF4] font-medium">Sem pendências</p>
          <p className="text-sm text-[#8899B3] mt-1">
            Todas as contas importadas foram reconciliadas.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {contas.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 p-4 rounded-[10px] bg-[#1A1F29] border border-[#252D3D] hover:border-[#00D4FF]/30 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-[#E8ECF4] font-medium truncate">{c.name}</p>
                <p className="text-xs text-[#8899B3] mt-0.5">
                  Etapa legada: {c.source === 'fora_de_escopo' ? 'fora de escopo' : 'Kommo'} · sem
                  CNPJ · sem responsável
                </p>
              </div>
              <button
                onClick={() => abrirEdicao(c)}
                className="shrink-0 px-4 py-2 rounded-[8px] bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-sm hover:bg-[#00D4FF]/20 transition-colors"
              >
                Corrigir
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de correção */}
      {editando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[#1A1F29] border border-[#2A3242] rounded-[16px] p-6">
            <h2 className="text-lg font-semibold text-[#E8ECF4] mb-1">Corrigir conta</h2>
            <p className="text-sm text-[#8899B3] mb-4 truncate">{editando.name}</p>

            {erroForm && (
              <div
                className="mb-4 p-3 rounded-[10px] bg-[#2A1215] border border-[#FF6B6B]/60 text-xs text-[#FF6B6B]"
                role="alert"
              >
                {erroForm}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="corr-setor"
                  className="block text-xs font-medium text-[#8899B3] mb-1.5"
                >
                  Setor <span className="text-[#FF6B6B]">*</span>
                </label>
                <input
                  id="corr-setor"
                  value={setor}
                  onChange={(e) => setSetor(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#12161F] text-[#E8ECF4] text-sm rounded-[10px] border border-[#252D3D] focus:border-[#00D4FF] outline-none"
                  placeholder="Ex.: Alimentação, Varejo..."
                />
              </div>
              <div>
                <label
                  htmlFor="corr-regiao"
                  className="block text-xs font-medium text-[#8899B3] mb-1.5"
                >
                  Região (UF)
                </label>
                <input
                  id="corr-regiao"
                  value={regiao}
                  onChange={(e) => setRegiao(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#12161F] text-[#E8ECF4] text-sm rounded-[10px] border border-[#252D3D] focus:border-[#00D4FF] outline-none"
                  placeholder="Ex.: RS"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setEditando(null)}
                className="px-4 py-2.5 rounded-[10px] bg-[#12161F] border border-[#252D3D] text-[#8899B3] text-sm hover:text-[#E8ECF4] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={salvando}
                className="px-4 py-2.5 rounded-[10px] bg-[#00D4FF] text-[#0F1218] text-sm font-semibold hover:bg-[#00D4FF]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {salvando && <Loader2 className="w-4 h-4 animate-spin" />}
                Salvar correção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
