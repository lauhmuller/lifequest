import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../types'

interface AppState {
  session: Session | null
  profile: Profile | null
  loading: boolean
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  fetchProfile: () => Promise<void>
  initRealtimeProfile: () => () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  session: null,
  profile: null,
  loading: true,

  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),

  fetchProfile: async () => {
    const { session } = get()
    if (!session) return
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (!error) set({ profile: data as Profile })
    set({ loading: false })
  },

  // Escuta mudanças em tempo real no perfil (ex: XP mudou em outro dispositivo)
  initRealtimeProfile: () => {
    const { session } = get()
    if (!session) return () => {}

    const channel = supabase
      .channel('profile-sync')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${session.user.id}`
        },
        (payload) => {
          set({ profile: payload.new as Profile })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }
}))
