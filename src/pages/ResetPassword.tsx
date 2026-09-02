import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nova-senha`
    })
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface rounded-quest shadow-sm p-8 space-y-5"
      >
        <div className="text-center space-y-1">
          <h1 className="font-display text-2xl text-primary-dark">Recuperar senha</h1>
          <p className="text-muted text-sm">Enviaremos um link para o seu e-mail</p>
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

        {error && <p className="text-sm text-red-500">{error}</p>}
        {sent && <p className="text-sm text-primary-dark">Link enviado! Confira seu e-mail.</p>}

        <button
          type="submit"
          className="w-full bg-primary-dark text-white rounded-xl py-2 font-semibold hover:opacity-90 transition"
        >
          Enviar link
        </button>

        <p className="text-sm text-muted text-center">
          <Link to="/login" className="text-primary-dark underline">
            Voltar para o login
          </Link>
        </p>
      </form>
    </div>
  )
}
