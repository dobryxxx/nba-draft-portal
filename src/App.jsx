import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Home from './views/Home'
import ProspectList from './views/ProspectList'
import BigBoard from './views/BigBoard'
import MockDraft from './views/MockDraft'
import DataQualityReview from './views/DataQualityReview'
import PlayerProfile from './views/PlayerProfile'
import { prospects as baseProspects } from './data/prospects'

const VIEWS = {
  prospects: { id: 'prospects', label: 'Prospect DB', icon: '●' },
  bigboard: { id: 'bigboard', label: 'Big Board', icon: '▦' },
  mockdraft: { id: 'mockdraft', label: 'Mock Draft Sim', icon: '◎' },
  dataquality: { id: 'dataquality', label: 'Data Quality', icon: '✓' },
}

const STORAGE_KEY = 'nba-draft-2026-custom-board-v2'

const withRanks = (items) =>
  items.map((prospect, index) => ({ ...prospect, rank: index + 1 }))

const baseById = new Map(baseProspects.map(prospect => [prospect.id, prospect]))

const normalizeTier = (tier) => ({
  ALL_STAR: 'LOTTERY',
  STARTER: 'MID_1ST',
  FRINGE: 'MID_1ST',
  ROLE_PLAYER: 'SLEEPER',
}[tier] || tier)

const hydrateProspect = (prospect) => {
  const fresh = baseById.get(prospect.id)
  if (!fresh) return prospect
  return {
    ...fresh,
    rank: prospect.rank,
    tier: normalizeTier(prospect.tier || fresh.tier),
  }
}

const loadProspects = () => {
  if (typeof window === 'undefined') return baseProspects

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    if (!saved?.order || !saved?.tiers) return baseProspects

    const byId = new Map(baseProspects.map(p => [p.id, p]))
    const ordered = saved.order
      .map(id => byId.get(id))
      .filter(Boolean)
      .map(p => ({ ...p, tier: normalizeTier(saved.tiers[p.id] || p.tier) }))

    const missing = baseProspects
      .filter(p => !saved.order.includes(p.id))
      .map(p => ({ ...p, tier: normalizeTier(saved.tiers[p.id] || p.tier) }))

    return withRanks([...ordered, ...missing])
  } catch {
    return baseProspects
  }
}

export default function App() {
  const [activeView, setActiveView] = useState('home')
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('pt-BR'))
  const [prospects, setProspects] = useState(loadProspects)
  const [selectedPlayerId, setSelectedPlayerId] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('pt-BR')), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setProspects(current => withRanks(current.map(hydrateProspect)))
  }, [])

  useEffect(() => {
    const tiers = prospects.reduce((acc, prospect) => {
      acc[prospect.id] = prospect.tier
      return acc
    }, {})

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        order: prospects.map(p => p.id),
        tiers,
      })
    )
  }, [prospects])

  const moveProspect = (activeId, overId) => {
    if (!overId || activeId === overId) return

    setProspects(current => {
      const oldIndex = current.findIndex(p => p.id === activeId)
      const newIndex = current.findIndex(p => p.id === overId)
      if (oldIndex === -1 || newIndex === -1) return current

      const next = [...current]
      const [moved] = next.splice(oldIndex, 1)
      next.splice(newIndex, 0, moved)
      return withRanks(next)
    })
  }

  const updateTier = (prospectId, tier) => {
    setProspects(current =>
      current.map(prospect =>
        prospect.id === prospectId ? { ...prospect, tier } : prospect
      )
    )
  }

  const selectedPlayer = prospects.find(p => p.id === selectedPlayerId)
  const pageKey = selectedPlayer ? `player-${selectedPlayer.id}` : activeView
  const isProspectDatabase = !selectedPlayer && activeView === 'prospects'
  const pageMotion = isProspectDatabase
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }
    : {
        initial: { opacity: 0, y: 18, scale: 0.985, filter: 'blur(8px)' },
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -12, scale: 0.985, filter: 'blur(6px)' },
        transition: { type: 'spring', stiffness: 190, damping: 24, mass: 0.75 },
      }

  const renderView = () => {
    if (selectedPlayer) {
      return (
        <PlayerProfile
          prospect={selectedPlayer}
          onBack={() => setSelectedPlayerId(null)}
          onTierChange={updateTier}
        />
      )
    }

    switch (activeView) {
      case 'home':
        return <Home onNavigate={setActiveView} prospectCount={prospects.length} prospects={prospects} />
      case 'prospects':
        return <ProspectList prospects={prospects} onReorder={moveProspect} onTierChange={updateTier} onSelectProspect={setSelectedPlayerId} onOpenBoard={() => setActiveView('bigboard')} />
      case 'bigboard':
        return <BigBoard prospects={prospects} onReorder={moveProspect} onTierChange={updateTier} onSelectProspect={setSelectedPlayerId} />
      case 'mockdraft':
        return <MockDraft />
      case 'dataquality':
        return <DataQualityReview prospects={prospects} />
      default:
        return <ProspectList prospects={prospects} onReorder={moveProspect} onTierChange={updateTier} onSelectProspect={setSelectedPlayerId} onOpenBoard={() => setActiveView('bigboard')} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#edeae4' }}>
      <Sidebar views={VIEWS} activeView={activeView} onNavigate={setActiveView} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header
          className="flex-shrink-0 flex items-center justify-between px-6 py-3"
          style={{
            background: '#edeae4',
            boxShadow: '0 3px 10px #d4d0ca, 0 -1px 0 #fff',
            zIndex: 10,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted tracking-widest">NBA DRAFT /</span>
            <span className="font-sans text-sm font-semibold text-ink">
              {selectedPlayer ? selectedPlayer.name : VIEWS[activeView]?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <StatusChip label="Draft" value="2026" color="#a79be8" bg="#f1effc" />
            <StatusChip label="Classe" value={`${prospects.length} picks`} color="#8bbfe8" bg="#edf7fd" />
            <StatusChip label="Modo" value="Custom" color="#8bcfb4" bg="#edf9f3" />
            <span className="font-mono text-xs text-muted ml-2 tabular-nums">{time}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pageKey}
              className="min-h-full"
              initial={pageMotion.initial}
              animate={pageMotion.animate}
              exit={pageMotion.exit}
              transition={pageMotion.transition}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function StatusChip({ label, value, color, bg }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-pill"
      style={{
        background: bg,
        boxShadow: '2px 2px 5px #d4d0ca, -2px -2px 5px #ffffff',
      }}
    >
      <span className="font-sans text-[10px] font-medium" style={{ color: color + 'aa' }}>{label}</span>
      <span className="font-mono text-[10px] font-bold" style={{ color }}>{value}</span>
    </div>
  )
}



