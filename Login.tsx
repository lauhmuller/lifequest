import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('E-mail ou senha incorretos.')
      return
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface rounded-quest shadow-sm p-8 space-y-5"
      >
        <div className="text-center space-y-1">
          <h1 className="font-display text-3xl text-primary-dark">LifeQuest</h1>
          <p className="text-muted text-sm">Continue sua jornada</p>
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
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        <div className="flex justify-between text-sm text-muted">
          <Link to="/recuperar-senha" className="hover:text-primary-dark">
            Esqueci minha senha
          </Link>
          <Link to="/cadastro" className="hover:text-primary-dark">
            Criar conta
          </Link>
        </div>
      </form>
    </div>
  )
}
