export const tokens = {
  color: {
    bg: '#edeae4',
    ink: '#24211f',
    muted: '#6f6a64',
    low: '#9b948c',
    surface: 'rgba(255,255,255,0.42)',
    surfaceSoft: 'rgba(255,255,255,0.28)',
    surfaceStrong: 'rgba(255,255,255,0.64)',
    border: 'rgba(255,255,255,0.30)',
    elite: '#7c5ccf',
    lottery: '#5aaed6',
    mid: '#c9a941',
    sleeper: '#e6a06f',
    success: '#6fbf9c',
    risk: '#e8a6a6',
    warning: '#e0b66f',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  radius: {
    sm: '12px',
    md: '18px',
    lg: '24px',
    xl: '30px',
    pill: '999px',
  },
  shadow: {
    card: '0 12px 34px rgba(40,36,32,0.055)',
    premium: '0 28px 80px rgba(40,36,32,0.10)',
    inset: 'inset 3px 3px 8px rgba(180,172,162,.24), inset -3px -3px 8px rgba(255,255,255,.62)',
  },
}

export const surfaces = {
  base: 'border border-white/35 bg-white/35 backdrop-blur-xl shadow-[0_12px_34px_rgba(40,36,32,0.055)]',
  elevated: 'border border-white/45 bg-white/45 backdrop-blur-2xl shadow-[0_28px_80px_rgba(40,36,32,0.10)]',
  inset: 'border border-white/25 bg-white/20 backdrop-blur-md shadow-[inset_3px_3px_8px_rgba(180,172,162,.24),inset_-3px_-3px_8px_rgba(255,255,255,.62)]',
}

export const tabs = {
  bar: 'flex max-w-full flex-wrap items-center gap-1.5 rounded-[24px] border border-white/45 bg-white/35 p-1.5 shadow-[0_10px_30px_rgba(40,36,32,.055),inset_1px_1px_0_rgba(255,255,255,.72)] backdrop-blur-2xl',
  item: 'min-w-[96px] rounded-[18px] px-3 py-2 text-left transition-all duration-200',
}

export const glass = {
  primary: 'bg-white/40 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-[0_24px_70px_rgba(40,36,32,0.08)]',
  secondary: 'bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_16px_44px_rgba(40,36,32,0.06)]',
  tertiary: 'bg-white/15 backdrop-blur-md border border-white/15 rounded-xl',
  inner: 'bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_12px_34px_rgba(40,36,32,0.045)]',
  chip: 'bg-white/35 backdrop-blur-xl border border-white/35 rounded-full px-3 py-1',
  nav: 'bg-white/20 backdrop-blur-xl border border-white/20',
  panel: 'bg-white/40 backdrop-blur-2xl border border-white/40 rounded-[30px]',
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
  pageTitle: 'font-brand text-4xl font-extrabold tracking-tight text-neutral-900 md:text-5xl',
  heroTitle: 'font-brand text-5xl font-extrabold tracking-tight text-neutral-900 md:text-7xl',
  cardTitle: 'font-headline text-2xl font-black text-neutral-900',
  body: 'text-sm font-semibold leading-6 text-neutral-600',
  muted: 'text-sm font-semibold text-neutral-500',
  metricValue: 'font-numeric text-3xl font-extrabold tracking-tight text-violet-500',
  metricLabel: 'font-mono text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400',
}

export const tierStyles = {
  CORNERSTONE: {
    badge: 'bg-violet-100/70 text-violet-800 border border-violet-200/50',
    glow: 'rgba(124,58,237,0.30)',
    text: '#5b21b6',
    border: 'border-violet-200/50',
    background: 'rgba(238,233,251,0.72)',
  },
  ELITE: {
    badge: 'bg-yellow-100/75 text-yellow-800 border border-yellow-300/50',
    glow: 'rgba(212,175,55,0.25)',
    text: '#8a6a00',
    border: 'border-yellow-300/50',
    background: 'rgba(255,244,194,0.72)',
  },
  LOTTERY: {
    badge: 'bg-emerald-100/70 text-emerald-700 border border-emerald-200/50',
    glow: 'rgba(16,185,129,0.22)',
    text: '#047857',
    border: 'border-emerald-200/50',
    background: 'rgba(223,248,237,0.78)',
  },
  MID_1ST: {
    badge: 'bg-blue-100/70 text-blue-700 border border-blue-200/50',
    glow: 'rgba(59,130,246,0.22)',
    text: '#1d4ed8',
    border: 'border-blue-200/50',
    background: 'rgba(224,239,255,0.76)',
  },
  FRINGE: {
    badge: 'bg-orange-100/70 text-orange-700 border border-orange-200/50',
    glow: 'rgba(249,115,22,0.23)',
    text: '#c2410c',
    border: 'border-orange-200/50',
    background: 'rgba(255,237,213,0.76)',
  },
  SLEEPER: {
    badge: 'bg-stone-100/80 text-stone-700 border border-stone-300/50',
    glow: 'rgba(139,94,52,0.22)',
    text: '#5f3f20',
    border: 'border-stone-300/50',
    background: 'rgba(244,234,220,0.78)',
  },
}

export function normalizeTierKey(tier) {
  const value = String(tier || 'SLEEPER').toUpperCase()
  return { ALL_STAR: 'LOTTERY', STARTER: 'MID_1ST', FRINGE_FIRST: 'FRINGE', ROLE_PLAYER: 'SLEEPER' }[value] || value
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
