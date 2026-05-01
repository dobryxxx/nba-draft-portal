import { motion } from 'framer-motion'
import { getTeamColors, getTeamLogo } from '../utils/teamAssets.js'
import { cn, glass, motion as motionTokens } from '../styles/designSystem'

const SIZE = {
  sm: { box: 'h-9 w-9', img: 'h-6 w-6', text: 'text-[10px]' },
  md: { box: 'h-12 w-12', img: 'h-8 w-8', text: 'text-xs' },
  lg: { box: 'h-16 w-16', img: 'h-11 w-11', text: 'text-sm' },
  xl: { box: 'h-24 w-24', img: 'h-16 w-16', text: 'text-xl' },
}

export default function TeamLogoGlass({ teamId, size = 'md', showGlow = true, muted = false, className = '' }) {
  const logo = getTeamLogo(teamId)
  const colors = getTeamColors(teamId)
  const s = SIZE[size] || SIZE.md
  return (
    <motion.span
      whileHover={{ scale: 1.04 }}
      className={cn(glass.chip, 'relative inline-flex shrink-0 items-center justify-center rounded-[30%] p-0', motionTokens.softTransition, s.box, className)}
      style={{ boxShadow: showGlow ? '0 14px 36px ' + colors.primary + '22, inset 1px 1px 0 rgba(255,255,255,.55)' : 'inset 1px 1px 0 rgba(255,255,255,.55)' }}
    >
      {showGlow && <span className="pointer-events-none absolute inset-1 rounded-[30%] blur-xl" style={{ background: colors.primary, opacity: muted ? .08 : .16 }} />}
      {logo ? <img src={logo} alt={teamId || 'Team'} className={'relative object-contain ' + s.img + (muted ? ' opacity-55 saturate-50' : '')} draggable="false" /> : <span className={'relative font-mono font-black text-slate-700 ' + s.text}>{teamId || '--'}</span>}
    </motion.span>
  )
}