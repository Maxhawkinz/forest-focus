import { useMemo, useState } from 'react'
import { loadState, saveState } from './lib/storage'
import type { AppState } from './lib/types'
import { CheckSquare, Timer, Trees, Trophy, User, Target, Settings } from 'lucide-react'
import TaskList from './components/TaskList'
import FocusTimer from './components/FocusTimer'
import Forest from './components/Forest'
import Leaderboard from './components/Leaderboard'
import Profile from './components/Profile'
import DailyChallenges from './components/DailyChallenges'
import SettingsPage from './components/Settings'

type TabKey = 'tasks' | 'focus' | 'forest' | 'leaderboard' | 'profile' | 'challenges' | 'settings'

function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [tab, setTab] = useState<TabKey>('tasks')

  function updateState(mutator: (s: AppState) => AppState) {
    setState(prev => {
      const next = mutator(prev)
      saveState(next)
      return next
    })
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = useMemo(() => ([
    { key: 'tasks', label: 'Tasks', icon: <CheckSquare size={16} /> },
    { key: 'focus', label: 'Focus', icon: <Timer size={16} /> },
    { key: 'forest', label: 'Forest', icon: <Trees size={16} /> },
    { key: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={16} /> },
    { key: 'profile', label: 'Profile', icon: <User size={16} /> },
    { key: 'challenges', label: 'Challenges', icon: <Target size={16} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ]), [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700, fontSize: 20 }}>🌳 Forest Focus</div>
          <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={t.key === tab ? 'btn-primary' : 'btn-secondary'}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ padding: 16, flex: 1 }}>
        <div className="card-surface" style={{ padding: 16 }}>
          {tab === 'tasks' && <TaskList state={state} setState={updateState} />}
          {tab === 'focus' && <FocusTimer state={state} setState={updateState} />}
          {tab === 'forest' && <Forest state={state} />}
          {tab === 'leaderboard' && <Leaderboard state={state} />}
          {tab === 'profile' && <Profile state={state} setState={updateState} />}
          {tab === 'challenges' && <DailyChallenges state={state} />}
          {tab === 'settings' && <SettingsPage state={state} setState={updateState} />}
        </div>
      </main>

      <footer style={{ padding: 16, opacity: 0.7, fontSize: 12, textAlign: 'center' }}>
        Grow your focus. Grow your forest. 🌱✨
      </footer>
    </div>
  )
}

export default App
