import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ClipboardList, Filter, Flame, Pin, Plus, Search, Trash2 } from 'lucide-react'
import { cn, glass as dsGlass, glassCard, typography as dsTypography } from '../../styles/designSystem'

const categories = [
  { id: 'evaluation', label: 'Avaliacao', color: '#a79be8' },
  { id: 'fit', label: 'Fit NBA', color: '#7ab8e8' },
  { id: 'risk', label: 'Risco', color: '#e8a6a6' },
  { id: 'development', label: 'Desenvolvimento', color: '#6fbf9c' },
  { id: 'stats', label: 'Dados', color: '#e0b66f' },
]

const priorities = [
  { id: 'watch', label: 'Watch', color: '#7ab8e8' },
  { id: 'important', label: 'Important', color: '#e0b66f' },
  { id: 'decision', label: 'Decision', color: '#e8a6a6' },
]

const quickPrompts = [
  'Swing skill:',
  'Draft range:',
  'Best NBA fit:',
  'Main concern:',
  'Rewatch:',
]

const glassInner = cn(
  dsGlass.inner,
  'border-white/40 bg-white/30 shadow-[0_14px_40px_rgba(40,36,32,.055),inset_1px_1px_0_rgba(255,255,255,.62)]'
)

function nowLabel() {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

function readNotes(value) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.filter(Boolean)
  } catch {
    const text = String(value).trim()
    if (text) {
      return [{
        id: 'legacy-note',
        text,
        category: 'evaluation',
        priority: 'watch',
        pinned: false,
        createdAt: 'Nota importada',
      }]
    }
  }
  return []
}

function categoryMeta(id) {
  return categories.find(item => item.id === id) || categories[0]
}

function priorityMeta(id) {
  return priorities.find(item => item.id === id) || priorities[0]
}

function StatPill({ label, value, color }) {
  return (
    <div className="rounded-[24px] border border-white/35 bg-white/28 px-4 py-3 shadow-[inset_1px_1px_0_rgba(255,255,255,.54)] backdrop-blur-xl">
      <div className={dsTypography.metricLabel}>{label}</div>
      <div className="mt-1 font-numeric text-3xl font-extrabold leading-none" style={{ color }}>{value}</div>
    </div>
  )
}

function SegmentButton({ active, children, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[.14em] transition-all duration-200',
        active ? 'border-white/70 bg-white/72 shadow-[0_10px_26px_rgba(40,36,32,.07),inset_1px_1px_0_rgba(255,255,255,.78)]' : 'border-white/35 bg-white/24 hover:bg-white/42'
      )}
      style={{ color }}
    >
      {children}
    </button>
  )
}

function NoteCard({ note, onPin, onRemove }) {
  const cat = categoryMeta(note.category)
  const priority = priorityMeta(note.priority)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, scale: .985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: .97 }}
      whileHover={{ y: -4, scale: 1.006 }}
      className="relative min-h-[220px] overflow-hidden rounded-[32px] border border-white/40 bg-white/28 p-5 shadow-[0_20px_58px_rgba(40,36,32,.07),inset_1px_1px_0_rgba(255,255,255,.64)] backdrop-blur-2xl"
    >
      <span className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full blur-3xl" style={{ background: cat.color, opacity: .16 }} />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/52 to-transparent" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/45 bg-white/42 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em]" style={{ color: cat.color }}>
            {cat.label}
          </span>
          <span className="rounded-full border border-white/45 bg-white/30 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em]" style={{ color: priority.color }}>
            {priority.label}
          </span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onPin(note.id)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/32 text-mid transition hover:bg-white/60" aria-label="Fixar nota">
            <Pin size={15} fill={note.pinned ? cat.color : 'none'} style={{ color: note.pinned ? cat.color : undefined }} />
          </button>
          <button type="button" onClick={() => onRemove(note.id)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/32 text-mid transition hover:bg-white/60" aria-label="Apagar nota">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <p className="relative mt-5 whitespace-pre-wrap text-sm font-semibold leading-7 text-[#4f4943]">
        {note.text}
      </p>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/35 pt-4">
        <span className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">{note.createdAt}</span>
        {note.pinned && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/34 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.14em]" style={{ color: cat.color }}>
            <Pin size={12} fill={cat.color} /> pinned
          </span>
        )}
      </div>
    </motion.article>
  )
}

export default function ProfileNotes({ value = '', setValue, accent = '#a79be8', playerName = 'Prospecto' }) {
  const [items, setItems] = useState(() => readNotes(value))
  const [draft, setDraft] = useState('')
  const [category, setCategory] = useState('evaluation')
  const [priority, setPriority] = useState('watch')
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    setItems(readNotes(value))
  }, [value])

  const save = next => {
    setItems(next)
    setValue?.(JSON.stringify(next))
  }

  const addNote = () => {
    const text = draft.trim()
    if (!text) return
    const next = [{
      id: String(Date.now()),
      text,
      category,
      priority,
      pinned: priority === 'decision',
      createdAt: nowLabel(),
    }, ...items]
    save(next)
    setDraft('')
  }

  const removeNote = id => save(items.filter(item => item.id !== id))
  const togglePin = id => save(items.map(item => item.id === id ? { ...item, pinned: !item.pinned } : item))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter(item => filter === 'all' ? true : filter === 'pinned' ? item.pinned : item.category === filter)
      .filter(item => !q || item.text.toLowerCase().includes(q))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned))
  }, [items, filter, query])

  const highPriority = items.filter(item => item.priority === 'decision' || item.priority === 'important').length
  const pinned = items.filter(item => item.pinned).length

  return (
    <div className="grid gap-5 2xl:gap-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={glassCard('primary', 'relative overflow-hidden rounded-[38px] border-white/45 bg-white/40 p-5 shadow-[0_28px_86px_rgba(40,36,32,.09),inset_1px_1px_0_rgba(255,255,255,.72)] backdrop-blur-2xl md:p-6')}
      >
        <span className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full blur-3xl" style={{ background: accent, opacity: .15 }} />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/65 to-transparent opacity-75" />

        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,.92fr)]">
          <div>
            <div className={cn(dsTypography.sectionLabel, 'text-lo')}>PERSONAL SCOUTING BOARD</div>
            <h3 className="mt-2 font-sans text-[clamp(2.15rem,3vw,4rem)] font-extrabold leading-none tracking-tight text-slate-950">
              Notas de decisao
            </h3>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-[#5f5852]">
              Registre leituras de jogo, risco, fit e pontos para revisar antes de mover {playerName} no board.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <StatPill label="Notas" value={items.length} color={accent} />
              <StatPill label="Fixadas" value={pinned} color="#7ab8e8" />
              <StatPill label="Alta prioridade" value={highPriority} color="#e0b66f" />
            </div>
          </div>

          <div className={cn(glassInner, 'rounded-[32px] p-4 md:p-5')}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className={dsTypography.metricLabel}>Nova nota</div>
                <div className="mt-1 font-display text-2xl font-black text-ink">Scout memo</div>
              </div>
              <ClipboardList size={24} style={{ color: accent }} />
            </div>

            <textarea
              value={draft}
              onChange={event => setDraft(event.target.value)}
              className="min-h-[132px] w-full resize-none rounded-[26px] border border-white/35 bg-white/38 px-4 py-4 text-sm font-semibold leading-6 text-[#4f4943] outline-none placeholder:text-muted shadow-[inset_4px_4px_10px_rgba(210,204,196,.34),inset_-4px_-4px_10px_rgba(255,255,255,.72)] backdrop-blur-xl"
              placeholder="Ex: Reassistir posses contra pressao. Decidir se o jumper sustenta spacing NBA..."
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {quickPrompts.map(prompt => (
                <button key={prompt} type="button" onClick={() => setDraft(draft ? draft + '\n' + prompt + ' ' : prompt + ' ')} className="rounded-full border border-white/35 bg-white/28 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em] text-muted transition hover:bg-white/50">
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <div className="flex flex-wrap gap-2">
                {categories.map(item => (
                  <SegmentButton key={item.id} active={category === item.id} color={item.color} onClick={() => setCategory(item.id)}>
                    {item.label}
                  </SegmentButton>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {priorities.map(item => (
                    <SegmentButton key={item.id} active={priority === item.id} color={item.color} onClick={() => setPriority(item.id)}>
                      {item.label}
                    </SegmentButton>
                  ))}
                </div>
                <motion.button
                  type="button"
                  onClick={addNote}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: .98 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/62 px-5 py-3 font-mono text-[10px] font-black uppercase tracking-[.18em] shadow-[0_14px_34px_rgba(40,36,32,.07),inset_1px_1px_0_rgba(255,255,255,.82)] transition hover:bg-white/80"
                  style={{ color: accent }}
                >
                  <Plus size={16} /> Salvar nota
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className={glassCard('secondary', 'rounded-[34px] border-white/35 bg-white/28 p-4 md:p-5')}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-[260px] flex-1 items-center gap-3 rounded-[24px] border border-white/35 bg-white/32 px-4 py-3 shadow-[inset_1px_1px_0_rgba(255,255,255,.58)] backdrop-blur-xl">
            <Search size={16} className="text-lo" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Buscar nas notas"
              className="w-full bg-transparent text-sm font-bold text-ink outline-none placeholder:text-muted"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <SegmentButton active={filter === 'all'} color={accent} onClick={() => setFilter('all')}>Todas</SegmentButton>
            <SegmentButton active={filter === 'pinned'} color="#7ab8e8" onClick={() => setFilter('pinned')}>Fixadas</SegmentButton>
            {categories.map(item => (
              <SegmentButton key={item.id} active={filter === item.id} color={item.color} onClick={() => setFilter(item.id)}>
                {item.label}
              </SegmentButton>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map(note => (
            <NoteCard key={note.id} note={note} onPin={togglePin} onRemove={removeNote} />
          ))}
        </AnimatePresence>
      </section>

      {!filtered.length && (
        <section className="rounded-[34px] border border-dashed border-white/55 bg-white/18 px-6 py-12 text-center shadow-[inset_1px_1px_0_rgba(255,255,255,.45)] backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/35" style={{ color: accent }}>
            {items.length ? <Filter size={22} /> : <CheckCircle2 size={22} />}
          </div>
          <h3 className="mt-4 font-display text-2xl font-black text-ink">{items.length ? 'Nenhuma nota nesse filtro' : 'Board limpo por enquanto'}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-muted">
            {items.length ? 'Ajuste a busca ou escolha outra categoria.' : 'Crie a primeira nota quando encontrar um detalhe importante para a avaliacao.'}
          </p>
        </section>
      )}

      <section className="rounded-[28px] border border-white/30 bg-white/20 px-4 py-3 text-xs font-semibold leading-5 text-[#6f6a64] backdrop-blur-xl">
        <span className="inline-flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[.18em] text-lo">
          <Flame size={13} /> workflow
        </span>
        <span className="ml-2">Use Decision para notas que alteram ranking, Important para revisao e Watch para observacoes de acompanhamento.</span>
      </section>
    </div>
  )
}
