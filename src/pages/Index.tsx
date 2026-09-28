import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, CheckCircle2, ShieldCheck, User } from 'lucide-react'

export default function Index() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  // Se não estiver autenticado, redireciona para /login
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0F1218]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#00D4FF]/20 border-t-[#00D4FF] rounded-full animate-spin" />
          <span className="text-xs text-[#8899B3] tracking-wide font-medium">
            Verificando sessão...
          </span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 tech-grid-bg relative selection:bg-[#00D4FF]/20 selection:text-[#00D4FF]">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #00D4FF 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #0077FF 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-[620px] bg-[#1A1F29] border border-[#2A3242] rounded-[16px] shadow-[0_24px_50px_rgba(0,0,0,0.6)] p-6 sm:p-10 relative overflow-hidden animate-card-enter">
        {/* Top cyan gradient accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: 'linear-gradient(90deg, #00D4FF 0%, #0077FF 100%)',
          }}
        />

        {/* Brand header */}
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

        {/* Welcome message */}
        <div className="mt-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-mono mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sessão autenticada ativa</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#E8ECF4] tracking-[-0.5px]">
            Bem-vindo ao Sistema SV Digital
          </h1>
          <p className="text-sm text-[#8899B3] mt-2 leading-relaxed">
            Autenticação concluída com sucesso. O fluxo de login de ponta a ponta com Supabase Auth
            está ativo e funcional.
          </p>
        </div>

        {/* User profile card */}
        <div className="mt-8 p-4 rounded-[12px] bg-[#12161F] border border-[#252D3D] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF] shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs text-[#8899B3] uppercase tracking-wider font-medium block">
              Usuário conectado
            </span>
            <p className="text-sm sm:text-base text-[#E8ECF4] font-mono truncate font-medium mt-0.5">
              {user.email}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 text-xs text-[#4CAF50] font-medium bg-[#4CAF50]/10 px-2.5 py-1 rounded-md border border-[#4CAF50]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Conectado</span>
          </div>
        </div>

        {/* System info */}
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
