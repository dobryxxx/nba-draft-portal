import { Activity, BarChart3, Database, FileText, Layers, PanelLeftClose, Target } from 'lucide-react'
import { cn, glass, layout, motion as motionTokens, typography } from '../styles/designSystem'

const NAV_SECTIONS = [
  {
    title: 'SCOUTING',
    items: [
      { id: 'prospects', fallbackLabel: 'Prospect Database', icon: Database, hint: 'Base completa de jogadores' },
      { id: 'bigboard', fallbackLabel: 'Big Board', icon: BarChart3, hint: 'Board customizavel' },
    ],
  },
  {
    title: 'SIMULATION',
    items: [
      { id: 'mockdraft', fallbackLabel: 'Mock Draft', icon: Target, hint: 'Ordem e War Room' },
    ],
  },
  {
    title: 'INTEL',
    items: [
      { id: 'draftintel', fallbackLabel: 'Draft Intel', icon: FileText, hint: 'Relatorios em breve', disabled: true },
    ],
  },
]

const STATUS = [
  { label: 'Draft Mode', value: 'Active', color: '#4f9577', bg: 'rgba(229,244,236,.7)' },
  { label: 'Board', value: 'Custom', color: '#7c5ccf', bg: 'rgba(238,233,251,.76)' },
]

export default function Sidebar({ views, activeView, onNavigate, isOpen = true, onToggle }) {
  const getLabel = (item) => views?.[item.id]?.label || item.fallbackLabel

  return (
    <aside
      data-state={isOpen ? 'open' : 'closed'}
      aria-hidden={!isOpen}
      className={cn(
        'app-sidebar group/sidebar relative flex flex-shrink-0 flex-col overflow-hidden border-r border-white/50 transition-[width,opacity,transform,filter] duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:w-64',
        layout.sidebarWidth,
        glass.nav,
        isOpen ? 'opacity-100 blur-0' : 'pointer-events-none -translate-x-3 opacity-0 blur-sm'
      )}
      style={{ zIndex: 20 }}
    >
      <div className="sidebar-panel-content flex min-h-0 flex-1 flex-col">
      <div className="px-5 pb-5 pt-6">
        <div className={cn('relative overflow-hidden p-4', glass.panel, 'shadow-[0_18px_44px_rgba(0,0,0,0.05)]')}>
          <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#eee9fb] blur-2xl" />
          <span className="pointer-events-none absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-[#edf7fd] blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center', glass.inner, 'shadow-[0_10px_24px_rgba(0,0,0,0.05)]')}>
                <Layers size={18} strokeWidth={2.4} className="text-[#7c5ccf]" />
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(glass.chip, 'px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[.18em] text-muted')}>
                  2026 Class
                </span>
                <button
                  type="button"
                  onClick={onToggle}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/45 bg-white/32 text-slate-600 shadow-[inset_1px_1px_0_rgba(255,255,255,.72)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/55 hover:text-[#7c5ccf] dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
                  aria-label="Esconder menu lateral"
                >
                  <PanelLeftClose size={15} strokeWidth={2.4} />
                </button>
              </div>
            </div>
            <div className="mt-4 font-brand text-2xl font-extrabold leading-none tracking-tight text-slate-800">
              Rookies Brasil
            </div>
            <div className="mt-1 font-mono text-[9px] font-black uppercase tracking-[.24em] text-muted">
              Draft Command Center
            </div>
            <div className="mt-4 grid gap-2">
              {STATUS.map(item => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/25 bg-white/24 px-3 py-2 backdrop-blur-md">
                  <span className={cn(typography.sectionLabel, 'text-[8px] tracking-[.16em] text-lo')}>{item.label}</span>
                  <span className="rounded-full px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-[.12em]" style={{ color: item.color, background: item.bg }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
        {NAV_SECTIONS.map(section => (
          <div key={section.title}>
            <div className={cn(typography.sectionLabel, 'mb-2 px-2 text-[9px] tracking-[.28em] text-lo')}>
              {section.title}
            </div>
            <div className="space-y-2">
              {section.items.map(item => {
                const Icon = item.icon
                const isActive = activeView === item.id
                const label = getLabel(item)
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.hint}
                    disabled={item.disabled}
                    onClick={() => !item.disabled && onNavigate(item.id)}
                    className={[
                      'relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-left', motionTokens.softTransition,
                      item.disabled ? 'cursor-not-allowed opacity-45' : 'hover:scale-[1.015] hover:bg-white/32 hover:shadow-[0_12px_26px_rgba(0,0,0,0.05)]',
                      isActive ? 'bg-white/42 shadow-[0_16px_36px_rgba(124,92,207,.13)]' : 'bg-white/14',
                    ].join(' ')}
                    style={{ border: isActive ? '1px solid rgba(255,255,255,.58)' : '1px solid rgba(255,255,255,.18)' }}
                  >
                    <span
                      className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full transition-opacity duration-200"
                      style={{ background: isActive ? '#7c5ccf' : 'transparent', boxShadow: isActive ? '0 0 18px rgba(124,92,207,.42)' : 'none' }}
                    />
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/24 backdrop-blur-md transition-all duration-200"
                      style={{ color: isActive ? '#7c5ccf' : '#8b837c', boxShadow: isActive ? 'inset 2px 2px 5px rgba(212,208,202,.65), inset -2px -2px 5px rgba(255,255,255,.75)' : '0 8px 18px rgba(0,0,0,.035)' }}
                    >
                      <Icon size={17} strokeWidth={2.35} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={['block truncate font-sans text-sm text-slate-700', isActive ? 'font-extrabold' : 'font-bold'].join(' ')}>{label}</span>
                      <span className="mt-0.5 block truncate font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted">{item.hint}</span>
                    </span>
                    {isActive && <span className="h-2 w-2 rounded-full bg-[#7c5ccf] shadow-[0_0_14px_rgba(124,92,207,.5)]" />}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 py-5">
        <div className={cn(glass.secondary, 'rounded-[24px] px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)]')}>
          <div className="flex items-center gap-2">
            <span className={cn('flex h-8 w-8 items-center justify-center text-[#4f9577]', glass.tertiary)}>
              <Activity size={16} strokeWidth={2.4} />
            </span>
            <div>
              <div className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-slate-600">Draft Engine Active</div>
              <div className="mt-0.5 font-mono text-[8px] font-black uppercase tracking-[.16em] text-lo">Build v0.1.0</div>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/35">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#7c5ccf] via-[#5aaed6] to-[#4f9577] opacity-80" />
          </div>
        </div>
      </div>
      </div>
    </aside>
  )
}
