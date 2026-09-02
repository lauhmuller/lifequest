import { useState, FormEvent } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAppStore } from '../store/useAppStore'

const THEMES = [
  { id: 'coquette', label: '🌸 Coquette Rosa' },
  { id: 'pastel', label: '🩷 Rosa Pastel' },
  { id: 'lilas', label: '💜 Lilás' },
  { id: 'dark', label: '🖤 Dark' },
  { id: 'minimal', label: '🤍 Minimalista' },
  { id: 'sage', label: '🌿 Sage Green' },
  { id: 'ocean', label: '🌊 Azul' }
]

export default function Settings() {
  const profile = useAppStore((s) => s.profile)
  const fetchProfile = useAppStore((s) => s.fetchProfile)
  const [taskName, setTaskName] = useState('')
  const [xp, setXp] = useState(10)
  const [saving, setSaving] = useState(false)
  const session = useAppStore((s) => s.session)

  async function changeTheme(themeId: string) {
    if (!session) return
    document.documentElement.setAttribute('data-theme', themeId)
    await supabase.from('profiles').update({ theme: themeId }).eq('id', session.user.id)
    fetchProfile()
  }

  async function addTask(e: FormEvent) {
    e.preventDefault()
    if (!session || !taskName.trim()) return
    setSaving(true)
    await supabase.from('tasks_config').insert({
      user_id: session.user.id,
      name: taskName.trim(),
      category: 'geral',
      frequency: 'diaria',
      xp_value: xp,
      coin_value: Math.max(1, Math.round(xp / 10))
    })
    setTaskName('')
    setXp(10)
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <section className="bg-surface rounded-quest p-6 shadow-sm">
        <h3 className="font-display text-lg text-primary-dark mb-4">Tema</h3>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTheme(t.id)}
              className={`rounded-xl border px-4 py-2 text-sm text-left transition ${
                profile?.theme === t.id
                  ? 'border-primary-dark bg-primary/10 font-semibold'
                  : 'border-primary/15 hover:bg-primary/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-surface rounded-quest p-6 shadow-sm">
        <h3 className="font-display text-lg text-primary-dark mb-4">Nova tarefa diária</h3>
        <form onSubmit={addTask} className="space-y-3">
          <div>
            <label className="text-sm text-ink">Nome da tarefa</label>
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Ex.: Beber 2,5L de água"
              className="w-full rounded-xl border border-primary/30 px-4 py-2 outline-none focus:border-primary-dark"
            />
          </div>
          <div>
            <label className="text-sm text-ink">XP ao concluir</label>
            <input
              type="number"
              min={1}
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              className="w-full rounded-xl border border-primary/30 px-4 py-2 outline-none focus:border-primary-dark"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-dark text-white rounded-xl px-5 py-2 font-semibold hover:opacity-90 transition"
          >
            {saving ? 'Salvando…' : 'Adicionar tarefa'}
          </button>
        </form>
      </section>
    </div>
  )
}
