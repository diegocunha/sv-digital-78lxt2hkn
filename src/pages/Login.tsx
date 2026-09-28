import { useState, useEffect } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export default function Login() {
  const { signIn, resetPassword, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Se já estiver logado, redirecionar para a rota pós-login
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true })
    }
  }, [user, authLoading, navigate])

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Field touch & errors
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)

  // Modal de recuperação
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryTouched, setRecoveryTouched] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)
  const [recoverySuccess, setRecoverySuccess] = useState(false)
  const [recoveryError, setRecoveryError] = useState<string | null>(null)

  // Validation logic
  const isEmailValid = (val: string) => {
    const trimmed = val.trim()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
  }

  const emailError =
    emailTouched &&
    (!email.trim()
      ? 'Informe seu e-mail'
      : !isEmailValid(email)
        ? 'Formato de e-mail inválido'
        : null)
  const passwordError =
    passwordTouched &&
    (!password
      ? 'Informe sua senha'
      : password.length < 6
        ? 'A senha deve ter no mínimo 6 caracteres'
        : null)
  const isFormValid = isEmailValid(email) && password.length >= 6

  // Fechar erro ao digitar novamente ou após 5s
  useEffect(() => {
    if (!generalError) return
    const timer = setTimeout(() => {
      setGeneralError(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [generalError])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (generalError) setGeneralError(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (generalError) setGeneralError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailTouched(true)
    setPasswordTouched(true)

    if (!isFormValid || isSubmitting) return

    setIsSubmitting(true)
    setGeneralError(null)

    const { error } = await signIn(email, password)

    if (error) {
      setIsSubmitting(false)
      setGeneralError('E-mail ou senha incorretos. Tente novamente.')
    } else {
      navigate('/', { replace: true })
    }
  }

  // Handler do modal de recuperação
  const handleOpenForgotModal = () => {
    setRecoveryEmail(email || '')
    setRecoveryTouched(false)
    setRecoverySuccess(false)
    setRecoveryError(null)
    setIsForgotModalOpen(true)
  }

  const handleCloseForgotModal = () => {
    setIsForgotModalOpen(false)
    setRecoverySuccess(false)
    setRecoveryError(null)
  }

  // Tecla ESC para fechar modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isForgotModalOpen) {
        handleCloseForgotModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isForgotModalOpen])

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRecoveryTouched(true)

    if (!isEmailValid(recoveryEmail) || isRecovering) return

    setIsRecovering(true)
    setRecoveryError(null)

    const { error } = await resetPassword(recoveryEmail)
    setIsRecovering(false)

    if (error) {
      setRecoveryError(error.message || 'Erro ao enviar instruções. Tente novamente.')
    } else {
      setRecoverySuccess(true)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0F1218]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#00D4FF]/20 border-t-[#00D4FF] rounded-full animate-spin" />
          <span className="text-xs text-[#8899B3] tracking-wide font-medium">
            Carregando sistema...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-10 px-4 tech-grid-bg relative selection:bg-[#00D4FF]/20 selection:text-[#00D4FF]">
      {/* Decorative ambient glow */}
      <div
        className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #00D4FF 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #0077FF 0%, transparent 70%)' }}
      />

      {/* Main Login Card */}
      <div
        className="w-full max-w-[420px] bg-[#1A1F29] border border-[#2A3242] rounded-[16px] shadow-[0_24px_50px_rgba(0,0,0,0.6)] relative overflow-hidden animate-card-enter p-6 sm:p-8 md:p-10"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 212, 255, 0.03)',
        }}
      >
        {/* Top cyan gradient accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: 'linear-gradient(90deg, #00D4FF 0%, #0077FF 100%)',
          }}
        />

        {/* Header / Logo section */}
        <div className="flex flex-col items-center text-center">
          <div className="h-16 flex items-center justify-center mb-3">
            <img
              src="https://www.svdigital.ind.br/wp-content/uploads/2020/06/MarcaFundoEscuro.png"
              alt="SV Digital - Comunicação Visual"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-all duration-300"
              style={{ filter: 'brightness(1.1)' }}
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-[#E8ECF4] tracking-[-0.5px]">
            Sistema SV Digital
          </h1>
          <p className="text-xs sm:text-sm text-[#8899B3] mt-1">Acesse sua conta para continuar</p>
        </div>

        {/* Decorative code badge */}
        <div className="mt-6 mb-2 flex items-center justify-start">
          <span className="font-mono text-[11px] text-[#00D4FF]/60 select-none tracking-tight">
            &#123; &apos;auth&apos;: &apos;svdigital&apos; &#125;
          </span>
        </div>

        {/* Error Alert Box */}
        {generalError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-4 p-3.5 rounded-[10px] bg-[#2A1215] border border-[#FF6B6B]/80 text-[#E8ECF4] animate-fade-in flex items-start gap-2.5"
          >
            <AlertCircle className="w-5 h-5 text-[#FF6B6B] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="font-semibold block text-[#FF6B6B]">Erro de autenticação</strong>
              <span>{generalError}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* E-mail field */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs sm:text-sm font-medium text-[#8899B3] mb-1.5"
            >
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8899B3]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setEmailTouched(true)}
                className={`w-full min-h-[48px] pl-10 pr-4 py-3 bg-[#12161F] text-[#E8ECF4] placeholder:text-[#8899B3]/50 text-sm rounded-[10px] border transition-all duration-200 outline-none ${
                  emailError
                    ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                    : 'border-[#252D3D] focus:border-[#00D4FF] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.15)]'
                }`}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
            </div>
            {emailError && (
              <p id="email-error" className="text-xs text-[#FF6B6B] mt-1.5 animate-fade-in">
                {emailError}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs sm:text-sm font-medium text-[#8899B3] mb-1.5"
            >
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8899B3]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Sua senha"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setPasswordTouched(true)}
                className={`w-full min-h-[48px] pl-10 pr-11 py-3 bg-[#12161F] text-[#E8ECF4] placeholder:text-[#8899B3]/50 text-sm rounded-[10px] border transition-all duration-200 outline-none ${
                  passwordError
                    ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                    : 'border-[#252D3D] focus:border-[#00D4FF] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.15)]'
                }`}
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8899B3] hover:text-[#00D4FF] transition-colors focus:outline-none"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <p id="password-error" className="text-xs text-[#FF6B6B] mt-1.5 animate-fade-in">
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full min-h-[48px] py-3.5 px-4 rounded-[10px] font-semibold text-sm sm:text-base text-white tracking-[0.5px] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:ring-offset-2 focus:ring-offset-[#1A1F29] ${
                isFormValid && !isSubmitting
                  ? 'cursor-pointer hover:brightness-105 hover:shadow-[0_8px_24px_rgba(0,119,255,0.35)]'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              style={{
                background: 'linear-gradient(90deg, #00D4FF 0%, #0077FF 100%)',
              }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Entrar'
              )}
            </button>
          </div>

          {/* Forgot password link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleOpenForgotModal}
              className="text-xs sm:text-sm text-[#8899B3] hover:text-[#00D4FF] transition-colors duration-150 inline-block focus:outline-none focus:underline"
            >
              Esqueceu sua senha?
            </button>
          </div>
        </form>

        {/* Subtle footer info */}
        <div className="mt-8 pt-4 border-t border-[#252D3D]/50 text-center">
          <p className="text-[11px] text-[#8899B3]/60">
            SV Digital &bull; Soluções em Comunicação Visual &bull; Porto Alegre (RS)
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(10,12,17,0.9)] backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseForgotModal()
          }}
        >
          <div className="w-full max-w-[420px] bg-[#1A1F29] border border-[#2A3242] rounded-[16px] shadow-[0_24px_60px_rgba(0,0,0,0.8)] relative p-6 sm:p-8 animate-modal-enter">
            {/* Close button */}
            <button
              type="button"
              onClick={handleCloseForgotModal}
              className="absolute top-4 right-4 p-1.5 text-[#8899B3] hover:text-[#E8ECF4] hover:bg-[#252D3D] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[10px] bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF]">
                <Lock className="w-5 h-5" />
              </div>
              <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-[#E8ECF4]">
                Recuperar senha
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#8899B3] mt-2 mb-5 leading-relaxed">
              Digite seu e-mail cadastrado e enviaremos instruções para redefinir sua senha.
            </p>

            {/* Recovery Success State */}
            {recoverySuccess ? (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-[10px] bg-[#4CAF50]/10 border border-[#4CAF50]/40 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-[#E8ECF4] leading-relaxed">
                    <strong className="block font-semibold text-[#4CAF50] mb-0.5">
                      Instruções enviadas!
                    </strong>
                    Verifique seu e-mail para continuar com a recuperação da sua conta.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseForgotModal}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-[10px] font-medium text-sm text-white bg-gradient-to-r from-[#00D4FF] to-[#0077FF] hover:brightness-105 transition-all shadow-[0_4px_16px_rgba(0,119,255,0.3)]"
                >
                  Concluir
                </button>
              </div>
            ) : (
              /* Recovery Form */
              <form onSubmit={handleRecoverySubmit} noValidate className="space-y-4">
                {recoveryError && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="p-3 rounded-[10px] bg-[#2A1215] border border-[#FF6B6B]/80 text-[#FF6B6B] text-xs flex items-center gap-2 animate-fade-in"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="recovery-email"
                    className="block text-xs sm:text-sm font-medium text-[#8899B3] mb-1.5"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8899B3]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="recovery-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      onBlur={() => setRecoveryTouched(true)}
                      className={`w-full min-h-[48px] pl-10 pr-4 py-3 bg-[#12161F] text-[#E8ECF4] placeholder:text-[#8899B3]/50 text-sm rounded-[10px] border transition-all duration-200 outline-none ${
                        recoveryTouched && !isEmailValid(recoveryEmail)
                          ? 'border-[#FF6B6B] focus:border-[#FF6B6B]'
                          : 'border-[#252D3D] focus:border-[#00D4FF] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.15)]'
                      }`}
                    />
                  </div>
                  {recoveryTouched && !isEmailValid(recoveryEmail) && (
                    <p className="text-xs text-[#FF6B6B] mt-1.5">Informe um e-mail válido</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseForgotModal}
                    className="order-2 sm:order-1 flex-1 min-h-[44px] py-2.5 px-4 rounded-[10px] border border-[#2A3242] text-[#8899B3] hover:text-[#E8ECF4] hover:bg-[#252D3D]/50 text-sm font-medium transition-colors focus:outline-none"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isRecovering || !isEmailValid(recoveryEmail)}
                    className={`order-1 sm:order-2 flex-1 min-h-[44px] py-2.5 px-4 rounded-[10px] font-semibold text-sm text-white tracking-[0.5px] transition-all flex items-center justify-center gap-2 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                      isEmailValid(recoveryEmail) && !isRecovering
                        ? 'cursor-pointer hover:brightness-105 hover:shadow-[0_8px_24px_rgba(0,119,255,0.35)]'
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    style={{
                      background: 'linear-gradient(90deg, #00D4FF 0%, #0077FF 100%)',
                    }}
                  >
                    {isRecovering ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Enviar instruções'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
