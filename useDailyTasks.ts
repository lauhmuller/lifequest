import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAppStore } from '../store/useAppStore'
import type { TaskConfig, TaskLog } from '../types'

const today = () => new Date().toISOString().slice(0, 10)

export function useDailyTasks() {
  const session = useAppStore((s) => s.session)
  const [tasks, setTasks] = useState<TaskConfig[]>([])
  const [logsToday, setLogsToday] = useState<TaskLog[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!session) return
    setLoading(true)

    const [{ data: taskData }, { data: logData }] = await Promise.all([
      supabase
        .from('tasks_config')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('frequency', 'diaria')
        .eq('active', true),
      supabase
        .from('task_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('completed_at', today())
    ])

    setTasks((taskData as TaskConfig[]) ?? [])
    setLogsToday((logData as TaskLog[]) ?? [])
    setLoading(false)
  }, [session])

  useEffect(() => {
    load()
  }, [load])

  // Sincronização em tempo real: se outro dispositivo marcar uma tarefa,
  // este dispositivo atualiza sozinho.
  useEffect(() => {
    if (!session) return
    const channel = supabase
      .channel('task-logs-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task_logs', filter: `user_id=eq.${session.user.id}` },
        () => load()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [session, load])

  const isDone = (taskId: string) => logsToday.some((l) => l.task_id === taskId)

  async function toggleTask(task: TaskConfig) {
    if (!session) return
    const existing = logsToday.find((l) => l.task_id === task.id)

    if (existing) {
      // Desmarcar: remove o log (e o gatilho de XP não roda para reversão automática
      // nesta versão inicial — ajustamos isso na Etapa 4 junto do sistema de conquistas)
      await supabase.from('task_logs').delete().eq('id', existing.id)
    } else {
      await supabase.from('task_logs').insert({
        user_id: session.user.id,
        task_id: task.id,
        completed_at: today(),
        xp_earned: task.xp_value,
        coins_earned: task.coin_value
      })
    }
  }

  return { tasks, loading, isDone, toggleTask, refresh: load }
}
