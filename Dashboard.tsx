import { useAppStore } from '../store/useAppStore'
import { useDailyTasks } from '../hooks/useDailyTasks'

function xpForNextLevel(level: number) {
  return level * 300
}

export default function Dashboard() {
  const profile = useAppStore((s) => s.profile)
  const { tasks, loading, isDone, toggleTask } = useDailyTasks()

  if (!profile) return <p className="text-muted">Carregando seu perfil…</p>

  const nextLevelXp = xpForNextLevel(profile.level)
  const currentLevelBaseXp = (profile.level - 1) * 300
  const progressPct = Math.min(
    100,
    Math.round(((profile.xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100)
  )
  const doneCount = tasks.filter((t) => isDone(t.id)).length

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Cartão de perfil */}
      <section className="bg-surface rounded-quest p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-primary-dark">
              🌸 {profile.display_name}
            </h2>
            <p className="text-muted text-sm">
              Nível {profile.level} — {profile.title}
            </p>
          </div>
          <div className="text-right text-sm text-muted">
            <p>🪙 {profile.coins} moedas</p>
            <p>🔥 {profile.streak} dias seguidos</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>⭐ {profile.xp} XP</span>
            <span>{nextLevelXp} XP para o próximo nível</span>
          </div>
          <div className="w-full h-3 rounded-full bg-primary/15 overflow-hidden">
            <div
              className="h-full bg-primary-dark transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Resumo do dia */}
      <section className="bg-surface rounded-quest p-6 shadow-sm">
        <h3 className="font-display text-lg text-primary-dark mb-4">Tarefas de hoje</h3>

        {loading && <p className="text-muted text-sm">Carregando tarefas…</p>}

        {!loading && tasks.length === 0 && (
          <p className="text-muted text-sm">
            Você ainda não configurou nenhuma tarefa diária. Vá em Ajustes para adicionar suas
            primeiras missões (ex.: beber água, treinar, estudar).
          </p>
        )}

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id}>
              <label className="flex items-center gap-3 rounded-xl border border-primary/15 px-4 py-3 cursor-pointer hover:bg-primary/5">
                <input
                  type="checkbox"
                  checked={isDone(task.id)}
                  onChange={() => toggleTask(task)}
                  className="w-5 h-5 accent-primary-dark"
                />
                <span className={isDone(task.id) ? 'line-through text-muted' : 'text-ink'}>
                  {task.name}
                </span>
                <span className="ml-auto text-xs text-gold font-semibold">
                  +{task.xp_value} XP
                </span>
              </label>
            </li>
          ))}
        </ul>

        {tasks.length > 0 && (
          <p className="text-xs text-muted mt-4">
            {doneCount} de {tasks.length} tarefas concluídas hoje.
          </p>
        )}
      </section>
    </div>
  )
}
