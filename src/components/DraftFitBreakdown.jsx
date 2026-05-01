const BREAKDOWN_ROWS = [
  ['draftRangeFit', 'Draft Range'],
  ['availabilityFit', 'Availability'],
  ['teamNeedFit', 'Team Need'],
  ['teamStrategyFit', 'Strategy Fit'],
]

const clampScore = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)))

export function getDraftFitStatus(fit) {
  const flags = fit?.flags || []
  if (!fit || fit.realism === 'Blocked' || fit.label === 'Blocked Fit' || flags.includes('Blocked by draft capital')) {
    return { label: 'Bloqueado', tone: '#a8844f', bg: 'rgba(246,231,168,.36)', copy: 'Sem pick compatível no range.' }
  }
  if (flags.includes('Reach risk')) {
    return { label: 'Reach', tone: '#d98972', bg: 'rgba(248,216,198,.42)', copy: 'Escolha acima do range esperado.' }
  }
  if (flags.includes('Unlikely available')) {
    return { label: 'Pouco disponível', tone: '#c9869a', bg: 'rgba(245,204,215,.42)', copy: 'Tende a sair antes desta pick.' }
  }
  if (flags.includes('Pick range match')) {
    return { label: 'Dentro do range', tone: '#6f63c7', bg: 'rgba(232,225,252,.48)', copy: 'Pick conversa com a faixa esperada.' }
  }
  if (flags.includes('Likely available')) {
    return { label: 'Alcançável', tone: '#5aaed6', bg: 'rgba(217,239,249,.48)', copy: 'Janela realista de escolha.' }
  }
  return { label: fit.realism || 'Fit', tone: '#8b837c', bg: 'rgba(255,255,255,.34)', copy: 'Fit estimado pelo contexto do draft.' }
}

export default function DraftFitBreakdown({ fit, color = '#7c5ccf', compact = false }) {
  if (!fit?.components) return null

  return (
    <div className={(compact ? 'space-y-2 rounded-[18px] p-3' : 'space-y-3 rounded-[24px] p-4') + ' border border-white/30 bg-white/24 backdrop-blur-md'}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[8px] font-black uppercase tracking-[.22em] text-lo">Score breakdown</span>
        <span className="font-mono text-[8px] font-black uppercase tracking-[.16em] text-muted">0-100</span>
      </div>
      {BREAKDOWN_ROWS.map(([key, label]) => {
        const value = clampScore(fit.components[key])
        return (
          <div key={key} className="grid grid-cols-[96px_1fr_34px] items-center gap-2">
            <span className="truncate font-mono text-[8px] font-black uppercase tracking-[.12em] text-muted">{label}</span>
            <span className="h-2 overflow-hidden rounded-full border border-white/25 bg-white/30 shadow-[inset_2px_2px_6px_rgba(180,172,162,.20),inset_-2px_-2px_6px_rgba(255,255,255,.55)]">
              <span className="block h-full rounded-full transition-all duration-500" style={{ width: value + '%', background: `linear-gradient(90deg, ${color}, rgba(116,184,220,.82))`, boxShadow: `0 0 18px ${color}33` }} />
            </span>
            <span className="text-right font-mono text-[9px] font-black text-mid">{value}</span>
          </div>
        )
      })}
    </div>
  )
}
