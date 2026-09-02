import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { useAppStore } from './store/useAppStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Health from './pages/Health'
import Evolution from './pages/Evolution'
import Store from './pages/Store'
import Settings from './pages/Settings'

function RequireAuth({ children }: { children: JSX.Element }) {
  const session = useAppStore((s) => s.session)
  const loading = useAppStore((s) => s.loading)
  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando…</div>
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const session = useAppStore((s) => s.session)
  const setSession = useAppStore((s) => s.setSession)
  const setLoading = useAppStore((s) => s.setLoading)
  const fetchProfile = useAppStore((s) => s.fetchProfile)
  const initRealtimeProfile = useAppStore((s) => s.initRealtimeProfile)
  const profile = useAppStore((s) => s.profile)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) setLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [setSession, setLoading])

  useEffect(() => {
    if (session) fetchProfile()
  }, [session, fetchProfile])

  useEffect(() => {
    if (!session) return
    const unsubscribe = initRealtimeProfile()
    return unsubscribe
  }, [session, initRealtimeProfile])

  useEffect(() => {
    if (profile?.theme) {
      document.documentElement.setAttribute('data-theme', profile.theme)
    }
  }, [profile?.theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<SignUp />} />
        <Route path="/recuperar-senha" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="saude" element={<Health />} />
          <Route path="evolucao" element={<Evolution />} />
          <Route path="loja" element={<Store />} />
          <Route path="config" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
