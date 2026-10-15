import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { usePapel } from '@/hooks/use-papel'
import { Loader2, ShieldCheck, LogOut, Database, Wrench, BarChart3, Users } from 'lucide-react'

// Visão inicial conforme o papel (RN-144): navegação renderiza o que o papel pode usar.
export default function Index() {
  const { user, loading, signOut } = useAuth()
  const { papel, pode, loading: papelLoading } = usePapel()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  if (loading || papelLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0F1218]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#00D4FF] animate-spin" />
          <span className="text-xs text-[#8899B3] tracking-wide font-medium">
            Verificando sessão...
          </span>
        </div>
      </div>
    )
  }

  if (!user) return null

  const NOME_PAPEL: Record<string, string> = {
    admin: 'Administrador',
    lider_comercial: 'Líder Comercial',
    prospector: 'Prospector',
    vendedor: 'Vendedor',
    leitor: 'Leitor',
  }

  const links = [
    {
      to: '/contas',
      label: 'Contas',
      desc: 'Base de contas com status e origem',
      icon: Database,
      mostrar: pode?.contas,
    },
    {
      to: '/correcoes',
      label: 'Fila de correção',
      desc: 'Contas importadas aguardando reconciliação',
      icon: Wrench,
      mostrar: pode?.corrigir,
    },
    {
      to: '/painel',
      label: 'Painel',
      desc: 'Indicadores com janela e cobertura',
      icon: BarChart3,
      mostrar: pode?.painel,
    },
  ].filter((l) => l.mostrar)

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 tech-grid-bg relative selection:bg-[#00D4FF]/20 selection:text-[#00D4FF]">
      <div
        className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #00D4FF 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #0077FF 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-[620px] bg-[#1A1F29] border border-[#2A3242] rounded-[16px] shadow-[0_24px_50px_rgba(0,0,0,0.6)] p-6 sm:p-10 relative overflow-hidden animate-card-enter">
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, #00D4FF 0%, #0077FF 100%)' }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#252D3D]">
          <img
            src="https://www.svdigital.ind.br/wp-content/uploads/2020/06/MarcaFundoEscuro.png"
            alt="SV Digital"
            className="h-10 sm:h-12 w-auto object-contain"
            style={{ filter: 'brightness(1.1)' }}
          />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#12161F] hover:bg-[#252D3D] text-[#8899B3] hover:text-[#FF6B6B] border border-[#252D3D] transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/40 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>

        <div className="mt-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-mono mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sessão autenticada ativa</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#E8ECF4] tracking-[-0.5px]">
            Bem-vindo ao Sistema SV Digital
          </h1>
          <p className="text-sm text-[#8899B3] mt-2 leading-relaxed">
            {papel
              ? `Você acessa como ${NOME_PAPEL[papel] ?? papel}. As telas abaixo seguem sua permissão.`
              : 'Sua conta não tem papel ativo na organização. Fale com o administrador.'}
          </p>
        </div>

        {/* Navegação conforme papel (RN-144) */}
        <div className="mt-8 space-y-3">
          {links.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-4 p-4 rounded-[12px] bg-[#12161F] border border-[#252D3D] hover:border-[#00D4FF]/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[#E8ECF4] font-medium group-hover:text-[#00D4FF] transition-colors">
                  {label}
                </p>
                <p className="text-xs text-[#8899B3] mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
          {pode?.usuarios && (
            <div className="flex items-center gap-4 p-4 rounded-[12px] bg-[#12161F] border border-[#252D3D] opacity-60">
              <div className="w-10 h-10 rounded-[10px] bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[#E8ECF4] font-medium">Usuários</p>
                <p className="text-xs text-[#8899B3] mt-0.5">
                  Gestão de acessos — disponível em fase futura
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-[#252D3D]/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8899B3]">
          <span>
            ID:{' '}
            <code className="text-[#00D4FF]/80 text-[11px] font-mono">
              {user.id.slice(0, 13)}...
            </code>
          </span>
          <span>SV Digital &bull; Porto Alegre (RS)</span>
        </div>
      </div>
    </div>
  )
}
