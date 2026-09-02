export interface Profile {
  id: string
  display_name: string
  title: string
  avatar_url: string | null
  height_cm: number | null
  theme: string
  level: number
  xp: number
  coins: number
  streak: number
  last_activity_date: string | null
}

export interface TaskConfig {
  id: string
  user_id: string
  name: string
  category: string
  frequency: 'diaria' | 'semanal' | 'mensal'
  xp_value: number
  coin_value: number
  active: boolean
}

export interface TaskLog {
  id: string
  user_id: string
  task_id: string
  completed_at: string
  xp_earned: number
  coins_earned: number
}

export interface WeightLog {
  id: string
  user_id: string
  logged_at: string
  weight_kg: number
}
