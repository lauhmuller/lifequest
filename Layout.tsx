import { Outlet, NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAppStore } from '../store/useAppStore'

const NAV_ITEMS = [
  { to: '/', label: 'Início', icon: '🏠' },
  { to: '/saude', label: 'Saúde', icon: '❤️' },
  { to: '/evolucao', label: 'Evolução', icon: '📈' },
  { to: '/loja', label: 'Loja', icon: '🛍️' },
  { to: '/config', label: 'Ajustes', icon: '⚙️' }
]

export default function Layout() {
  const profile = useAppStore((s) => s.profile)

  return (
    <div className="min-h-screen bg-bg md:flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-primary/15 md:p-6">
        <h1 className="font-display text-2xl text-primary-dark mb-8">🌸 LifeQuest</h1>
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2 transition ${
                  isActive ? 'bg-primary/20 text-primary-dark font-semibold' : 'text-ink hover:bg-primary/10'
                }`
              }
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-muted hover:text-primary-dark text-left"
        >
          Sair da conta
        </button>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 pb-20 md:pb-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-primary/15">
          <h1 className="font-display text-xl text-primary-dark">🌸 LifeQuest</h1>
          {profile && (
            <span className="text-sm text-muted">Nv. {profile.level} · {profile.coins} 🪙</span>
          )}
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Tab bar — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-primary/15 flex justify-around py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs px-2 py-1 ${
                isActive ? 'text-primary-dark' : 'text-muted'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
