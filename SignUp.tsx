import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name || 'Aventureiro(a)' } }
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4 text-center">
        <div className="max-w-sm space-y-3">
          <h1 className="font-display text-2xl text-primary-dark">Quase lá!</h1>
          <p className="text-ink">
            Enviamos um e-mail de confirmação. Abra sua caixa de entrada para ativar sua conta.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-primary-dark underline"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface rounded-quest shadow-sm p-8 space-y-5"
      >
        <div className="text-center space-y-1">
          <h1 className="font-display text-3xl text-primary-dark">Criar conta</h1>
          <p className="text-muted text-sm">Comece sua jornada no LifeQuest</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-ink">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-primary/30 px-4 py-2 outline-none focus:border-primary-dark"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-ink">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-primary/30 px-4 py-2 outline-none focus:border-primary-dark"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-ink">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-primary/30 px-4 py-2 outline-none focus:border-primary-dark"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-dark text-white rounded-xl py-2 font-semibold hover:opacity-90 transition"
        >
          {loading ? 'Criando…' : 'Criar conta'}
        </button>

        <p className="text-sm text-muted text-center">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary-dark underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
