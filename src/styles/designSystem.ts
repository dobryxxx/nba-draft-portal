export const glass = {
  primary: 'bg-white/35 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]',
  secondary: 'bg-white/25 backdrop-blur-lg border border-white/25 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.06)]',
  tertiary: 'bg-white/15 backdrop-blur-md border border-white/15 rounded-xl',
  inner: 'bg-white/25 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)]',
  chip: 'bg-white/30 backdrop-blur-md border border-white/20 rounded-full px-3 py-1',
  nav: 'bg-white/20 backdrop-blur-xl border border-white/20',
  panel: 'bg-white/30 backdrop-blur-xl border border-white/25 rounded-[28px]',
}

export const buttons = {
  primary: 'rounded-full bg-violet-500 px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_16px_36px_rgba(124,92,207,0.22)] transition-all duration-200 hover:scale-[1.02] hover:bg-violet-600 active:scale-[0.98]',
  secondary: 'rounded-full bg-white/30 px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 backdrop-blur-md border border-white/30 shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all duration-200 hover:scale-[1.02] hover:bg-white/45 active:scale-[0.98]',
  ghost: 'rounded-full bg-transparent px-5 py-2.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 transition-all duration-200 hover:bg-white/25 hover:scale-[1.01]',
  danger: 'rounded-full bg-rose-400 px-5 py-2.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(232,166,166,0.24)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
  success: 'rounded-full bg-emerald-400 px-5 py-2.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(79,149,119,0.22)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
}

export const typography = {
  sectionLabel: 'font-mono text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400',
  pageTitle: 'font-sans text-4xl font-extrabold tracking-tight text-neutral-900 md:text-5xl',
  heroTitle: 'font-sans text-5xl font-extrabold tracking-tight text-neutral-900 md:text-7xl',
  cardTitle: 'font-display text-2xl font-black text-neutral-900',
  body: 'text-sm font-semibold leading-6 text-neutral-600',
  muted: 'text-sm font-semibold text-neutral-500',
  metricValue: 'font-numeric text-3xl font-extrabold tracking-tight text-violet-500',
  metricLabel: 'font-mono text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400',
}

export const tierStyles = {
  ELITE: {
    badge: 'bg-violet-100/70 text-violet-700 border border-violet-200/50',
    glow: 'rgba(124,92,207,0.28)',
    text: '#5d46a3',
    border: 'border-violet-200/50',
    background: 'rgba(238,233,251,0.72)',
  },
  LOTTERY: {
    badge: 'bg-sky-100/70 text-sky-700 border border-sky-200/50',
    glow: 'rgba(90,174,214,0.24)',
    text: '#3f7fa0',
    border: 'border-sky-200/50',
    background: 'rgba(237,247,253,0.78)',
  },
  MID_1ST: {
    badge: 'bg-amber-100/70 text-amber-700 border border-amber-200/50',
    glow: 'rgba(201,169,65,0.24)',
    text: '#8a7023',
    border: 'border-amber-200/50',
    background: 'rgba(251,244,210,0.76)',
  },
  SLEEPER: {
    badge: 'bg-orange-100/70 text-orange-700 border border-orange-200/50',
    glow: 'rgba(230,160,111,0.22)',
    text: '#a8663b',
    border: 'border-orange-200/50',
    background: 'rgba(250,238,229,0.78)',
  },
}

export function normalizeTierKey(tier) {
  const value = String(tier || 'SLEEPER').toUpperCase()
  return { ALL_STAR: 'LOTTERY', STARTER: 'MID_1ST', FRINGE: 'MID_1ST', ROLE_PLAYER: 'SLEEPER' }[value] || value
}

export function getTierStyle(tier) {
  return tierStyles[normalizeTierKey(tier)] || tierStyles.SLEEPER
}

export const motion = {
  hoverLift: 'transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_18px_44px_rgba(0,0,0,0.08)]',
  softTransition: 'transition-all duration-300 ease-out',
  pageEnter: 'animate-fade-in',
  cardEnter: 'animate-slide-up',
  staggerContainer: 'motion-safe:transition-all',
}

export const motionPresets = {
  page: {
    initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -16, filter: 'blur(8px)' },
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
  card: {
    initial: { opacity: 0, y: 18, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  },
  stagger: {
    hidden: {},
    show: { transition: { staggerChildren: 0.075, delayChildren: 0.08 } },
  },
  heroReveal: {
    initial: { opacity: 0, scale: 0.94, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.98, filter: 'blur(6px)' },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export const layout = {
  page: 'relative min-h-full overflow-hidden px-5 py-5 md:px-6',
  section: 'mx-auto w-full max-w-7xl',
  gridTwo: 'grid gap-5 lg:grid-cols-2',
  gridThree: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  sidebarWidth: 'w-64',
  contentWithSidebar: 'flex h-screen overflow-hidden',
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function glassCard(variant = 'primary', extra = '') {
  return cn(glass[variant], extra)
}

export function badge(type = 'default', extra = '') {
  if (type === 'default') return cn(glass.chip, 'font-mono text-[8px] font-black uppercase tracking-[0.14em] text-neutral-500', extra)
  return cn('rounded-full px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[0.14em]', getTierStyle(type).badge, extra)
}
