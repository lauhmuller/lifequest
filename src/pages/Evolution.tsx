import { useEffect, useState, FormEvent } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../lib/supabaseClient'
import { useAppStore } from '../store/useAppStore'
import type { WeightLog } from '../types'

export default function Evolution() {
  const session = useAppStore((s) => s.session)
  const [logs, setLogs] = useState<WeightLog[]>([])
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!session) return
    const { data } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('logged_at', { ascending: true })
    setLogs((data as WeightLog[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [session])

  async function addWeight(e: FormEvent) {
    e.preventDefault()
    if (!session || !weight) return
    await supabase.from('weight_logs').upsert(
      {
        user_id: session.user.id,
        logged_at: new Date().toISOString().slice(0, 10),
        weight_kg: Number(weight)
      },
      { onConflict: 'user_id,logged_at' }
    )
    setWeight('')
    load()
  }

  const chartData = logs.map((l) => ({
    date: l.logged_at.slice(5),
    peso: l.weight_kg
  }))

  const current = logs.at(-1)?.weight_kg
  const initial = logs[0]?.weight_kg

  return (
    <div className="space-y-6 max-w-3xl">
      <section className="bg-surface rounded-quest p-6 shadow-sm">
        <h3 className="font-display text-lg text-primary-dark mb-4">Registrar peso de hoje</h3>
        <form onSubmit={addWeight} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-ink">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="ex.: 78.4"
              className="w-full rounded-xl border border-primary/30 px-4 py-2 outline-none focus:border-primary-dark"
            />
          </div>
          <button
            type="submit"
            className="bg-primary-dark text-white rounded-xl px-5 py-2 font-semibold hover:opacity-90 transition"
          >
            Salvar
          </button>
        </form>
      </section>

      <section className="bg-surface rounded-quest p-6 shadow-sm">
        <h3 className="font-display text-lg text-primary-dark mb-2">Evolução do peso</h3>
        {!loading && logs.length > 0 && (
          <p className="text-sm text-muted mb-4">
            Inicial: {initial} kg · Atual: {current} kg
            {initial && current ? ` · Variação: ${(current - initial).toFixed(1)} kg` : ''}
          </p>
        )}
        {loading && <p className="text-muted text-sm">Carregando…</p>}
        {!loading && logs.length === 0 && (
          <p className="text-muted text-sm">Registre seu primeiro peso para ver o gráfico aqui.</p>
        )}
        {!loading && logs.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="var(--color-muted)" fontSize={12} />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  stroke="var(--color-muted)"
                  fontSize={12}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="var(--color-primary-dark)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  )
}
