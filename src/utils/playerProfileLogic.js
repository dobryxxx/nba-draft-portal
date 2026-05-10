import { prospects as ALL_PROSPECTS } from '../data/prospects'
import { mergeProspectWithManualIntelligence } from '../data/prospectDraftIntelligence.ts'
import { PROSPECT_FLOOR_LABELS, PROSPECT_OUTCOME_LABELS } from '../data/prospectOptionSchema'

export const RADAR = ['Athleticism', 'Shooting', 'Playmaking', 'Defense', 'Rebounding', 'BBIQ']
export const ADV = [['ts','TS%',72,'%'],['efg','eFG%',70,'%'],['usg','USG%',38,'%'],['astTo','AST/TO',4,''],['blkPct','BLK%',8,'%'],['stlPct','STL%',4,'%'],['per','PER',35,'']]
export const PCTS = [['fgp','FG%',65],['threep','3PT%',45],['ftp','FT%',90]]
export const PROFILE_TITLES = {
  'AJ Dybantsa': 'Ala criador com teto de primeira opção',
  'Darryn Peterson': 'Guard pontuador com upside de estrela',
  'Cameron Boozer': 'Hub ofensivo pronto para impactar vitorias',
  'Caleb Wilson': 'Forward defensivo versatil com upside raro',
  'Keaton Wagler': 'Combo guard de leitura e arremesso',
  'Kingston Flemings': 'Motor downhill com velocidade de elite',
  'Mikel Brown Jr.': 'Criador primário leve e habilidoso',
  'Jayden Quaintance': 'Big defensivo de teto especial',
  'Nate Ament': 'Forward alto com toque e feel especial',
  'Yaxel Lendeborg': 'Forward maduro de impacto completo',
  'Labaron Philon': 'Guard competitivo pronto para rotação',
  'Allen Graves': 'Stretch big two-way de baixo erro',
  'Hannes Steinbach': 'Interior fisico com toque e rebote',
  'Darius Acuff Jr.': 'Scoring guard agressivo de alto volume',
  'Chris Cenac Jr.': 'Big moderno de desenvolvimento',
  'Bennett Stirtz': 'Maestro eficiente de pick-and-roll',
  'Tounde Yessoufou': 'Wing fisico de pressão constante',
  'Cameron Carr': 'Wing scorer com arremesso transponivel',
  'Dwayne Aristode': 'Ala de ferramentas modernas',
  'Karim Lopez': 'Projeto internacional de wing versatil',
  'Malachi Moreno': 'Center de tamanho com papel definido',
  'Amari Allen': 'Conector grande com feel e decisão',
  'Cayden Boozer': 'Armador cerebral de ritmo e passe',
  'Isaiah Evans': 'Wing shooter de alto valor',
  'Aday Mara': 'Rim protector gigante com passe subestimado',
  'Christian Anderson': 'Guard de rotação com skill transferivel',
  'Koa Peat': 'Forward fisico de motor e versatilidade',
  'Brayden Burries': 'Guard two-way com defesa no ponto da bola',
  'Meleek Thomas': 'Shot-maker de alta variancia',
  'Milan Momcilovic': 'Wing shooter premium',
  'Joshua Jefferson': 'Forward versatil de segundo round',
  'Ebuka Okorie': 'Driver downhill com explosao real',
  'Isiah Harwell': 'Guard de apoio com arremesso funcional',
  'Tyler Tanner': 'Guard two-way de crescimento tardio',
  'Henri Veesaar': 'Big de rotação com tamanho e toque',
  'Eric Reibe': 'Center europeu de base tecnica',
  'Dailyn Swain': 'Forward moderno de energia e defesa',
  'Braden Smith': 'Condutor veterano de eficiência elite',
  'Miles Byrd': 'Wing defensivo de comprimento NBA',
  'Zuby Ejiofor': 'Energy big de rebote e contato',
  'Nikolas Khamenia': 'Forward inteligente de suporte',
  'Juke Harris': 'Shooter especialista em desenvolvimento',
  'Alex Karaban': 'Forward de spacing e decisão rapida',
  'Joseph Tugler': 'Big fisico de defesa e finalizacao',
  'Matthew Able': 'Wing jovem de ferramentas projetaveis',
  'Flory Bidunga': 'Interior explosivo de rim running',
  'Tomislav Ivisic': 'Big europeu de toque e leitura',
  'Richie Saunders': 'Spot-up shooter pronto para papel',
  'Morez Johnson Jr.': 'Big de energia, rebote e finishing',
  'Milos Uzan': 'Terceiro guard de organizacao solida',
  'Mouhamed Sylla': 'Center longo de upside defensivo',
  'Tamin Lipsey': 'Guard defensivo de rotação',
  'Paul McNeil Jr.': 'Wing de tiro e tamanho',
  'Tahaad Pettiford': 'Guard pequeno de criacao explosiva',
  'Karter Knox': 'Forward scorer em desenvolvimento',
  'Wesley Yates': 'Guard scorer de profundidade'
}
export const COLORS = { strong: '#a79be8', avg: '#8bbfe8', weak: '#e8a6a6', miss: '#9b948b' }

export const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v))
export const num = (v, d = 1) => typeof v === 'number' && Number.isFinite(v) ?v.toFixed(d) : '-'
export const role = p => /C/.test(p||'') ?'big' : /PF/.test(p||'') ?'forward' : /SF/.test(p||'') ?'wing' : 'guard'
export const thresholds = { ppg:[12,20], ts:[55,62], efg:[50,57], usg:[18,28], astTo:[1.2,2.2], per:[18,25], blkPct:[1.5,3.5], stlPct:[1.4,2.6], ftp:[70,80], guard:{rpg:[3,5],apg:[3,6],fgp:[42,48],threep:[34,38]}, wing:{rpg:[4,6.5],apg:[2,4],fgp:[44,51],threep:[34,38]}, forward:{rpg:[5.5,8],apg:[1.8,3.5],fgp:[47,54],threep:[33,37]}, big:{rpg:[7,10],apg:[1.2,2.8],fgp:[52,60],threep:[31,36]} }
export const quality = (k, v, p) => { if (typeof v !== 'number') return COLORS.miss; const r = role(p.position); const [a,s] = thresholds[r]?.[k] || thresholds[k] || [0,1]; return v >= s ?COLORS.strong : v >= a ?COLORS.avg : COLORS.weak }
export const metricMax = (k, fallback) => Math.max(fallback, ...ALL_PROSPECTS.map(p=>p.stats?.[k]).filter(v=>typeof v==='number'))
export const metricNote = (k, v, p, fallbackMax) => { if (typeof v !== 'number') return 'sem dado confiavel na base'; const r=role(p.position), roleLabel=r === 'big' ?'big' : r === 'forward' ?'forward' : r === 'wing' ?'ala' : 'guard', [avg,strong]=thresholds[r]?.[k] || thresholds[k] || [fallbackMax*.45,fallbackMax*.7], max=metricMax(k,fallbackMax); if (v >= strong) return `nivel alto para ${roleLabel} · topo DB ${num(max)}`; if (v >= avg) return `faixa media/boa · topo DB ${num(max)}`; return `abaixo da referencia · topo DB ${num(max)}` }
export const profileHeadline = p => PROFILE_TITLES[p.name] || (() => { const s=p.stats||{}; if (p.tier === 'ELITE') return 'Talento de topo com caminho para estrela'; if ((s.ts||0) >= 60 && (s.usg||0) >= 24) return 'Criador eficiente de alto volume'; if ((s.threep||0) >= 38) return 'Especialista de spacing NBA'; if ((s.blkPct||0) >= 3 || (s.rpg||0) >= 9) return 'Interior de impacto fisico'; if ((s.astTo||0) >= 2 || (s.apg||0) >= 5) return 'Condutor secundario de rotação'; return 'Perfil NBA em desenvolvimento' })()
export const inches = v => { const m = String(v||'').match(/(\d+)'(?:([\d.]+))?/); return m ?Number(m[1])*12 + Number(m[2]||0) : null }
export const heightM = v => { const i = inches(v); return i == null ?(v || '-') : (Math.round(i*2.54)/100).toFixed(2).replace('.', ',') + ' m' }
export const wings = v => { const i = inches(v); return i == null ?(v || '-') : Math.round(i*2.54) + ' cm' }
export const weight = v => { const m = String(v||'').match(/[\d.]+/); return m ?Math.round(Number(m[0])*.45359237) + ' kg' : (v || '-') }
export const initials = n => String(n||'').split(' ').filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()
export const validOutcomeScore = value => typeof value === 'number' && Number.isFinite(value) && value >= 35
const FLOOR_SCORE_BY_KEY = { STARTER: 66, ROTATION: 56, BENCH: 46, TWO_WAY: 40, G_LEAGUE: 36, OVERSEAS: 35 }
const OUTCOME_SCORE_BY_KEY = { MVP: 92, FRANCHISE_PLAYER: 84, ALL_STAR: 74, STARTER: 64, ROTATION: 54, BENCH: 44, G_LEAGUE: 36 }
export const resolvedProspectIntelligence = p => p?.resolvedIntelligence || mergeProspectWithManualIntelligence(p || {}).resolvedIntelligence
export const manualEvaluation = p => p?.scouting?.evaluation || null
export const manualFloorScore = p => { const key = resolvedProspectIntelligence(p)?.projection?.floor; const score = FLOOR_SCORE_BY_KEY[key] ?? manualEvaluation(p)?.floor?.score; return validOutcomeScore(score) ?score : null }
export const manualCeilingScore = p => { const projection = resolvedProspectIntelligence(p)?.projection; const score = OUTCOME_SCORE_BY_KEY[projection?.ceiling] ?? projection?.projectionScoreOverride ?? manualEvaluation(p)?.ceiling?.score; return validOutcomeScore(score) ?score : null }
export const manualFloorLabel = p => { const key = resolvedProspectIntelligence(p)?.projection?.floor; if (key && PROSPECT_FLOOR_LABELS[key]) return PROSPECT_FLOOR_LABELS[key]; const label = manualEvaluation(p)?.floor?.label; return typeof label === 'string' && label.trim() ? label.trim() : null }
export const manualCeilingLabel = p => { const key = resolvedProspectIntelligence(p)?.projection?.ceiling || resolvedProspectIntelligence(p)?.projection?.realisticOutcome; if (key && PROSPECT_OUTCOME_LABELS[key]) return PROSPECT_OUTCOME_LABELS[key]; const label = manualEvaluation(p)?.ceiling?.label; return typeof label === 'string' && label.trim() ? label.trim() : null }
export const getResolvedFloorLabel = (p, score) => manualFloorLabel(p) || getFloorLabel(score)
export const getResolvedCeilingLabel = (p, score) => manualCeilingLabel(p) || getCeilingLabel(score)
export function estimateOutcomeScores(p) { const s=p.stats||{}, floor=Math.round(clamp(38+(s.ppg||0)*.7+(s.ts||50)*.35,35,92)), ceiling=Math.round(clamp(floor+14+(p.tier==='ELITE'?8:4),45,98)); return { floor: Math.min(floor, ceiling-1), ceiling } }
export function resolveOutcomeScores(p) { const estimated=estimateOutcomeScores(p), mf=manualFloorScore(p), mc=manualCeilingScore(p); let floor=mf ?? estimated.floor, ceiling=mc ?? estimated.ceiling; if(mf !== null && mc === null) ceiling=Math.max(estimated.ceiling, floor + (p.tier==='ELITE'?20:14)); if(mc !== null && mf === null) floor=Math.min(estimated.floor, ceiling - 10); floor=Math.round(clamp(floor,35,98)); ceiling=Math.round(clamp(ceiling,36,99)); if(floor >= ceiling) floor=Math.max(35, ceiling-1); return { floor, ceiling } }
export const attrValue = (p, label) => { const attrs=p.scouting?.attributes||{}, stats=p.stats||{}, manual=resolvedProspectIntelligence(p)?.manualTraits||{}, k=String(label||'').toLowerCase(); const trait = value => typeof value === 'number' ? clamp(value/10,1,10) : null; if(k.includes('shoot')) return trait(manual.shooting) || attrs.Shooting || clamp((stats.threep||25)/4.5,1,10); if(k.includes('score')) return trait(manual.creation) || trait(manual.rimPressure) || clamp((stats.ppg||12)/2.8,1,10); if(k.includes('play')||k.includes('connect')) return trait(manual.playmaking) || trait(manual.creation) || attrs.Playmaking || clamp((stats.apg||2)*1.35,1,10); if(k.includes('defend')) return trait(manual.defense) || attrs.Defense || clamp(Math.max(stats.stlPct||0,stats.blkPct||0)*2.1,1,10); if(k.includes('rebound')) return trait(manual.rebounding) || attrs.Rebounding || clamp((stats.rpg||4)/1.2,1,10); if(k.includes('motor')) return trait(manual.athleticism) || 7; return 6 }
export function getPlayerArchetype(p) { const s=p.stats||{}, r=role(p.position); if((s.ppg||0)>=18 && (s.usg||0)>=24) return r==='guard'?'Primary Shot Creator':'Go-To Scoring Forward'; if((s.threep||0)>=37 && /PF|C/.test(p.position||'')) return 'Stretch Big'; if((s.blkPct||0)>=3.5) return 'Defensive Anchor'; if((s.apg||0)>=4 || (s.astTo||0)>=2) return 'Connector / Playmaker'; if(/SG|SF/.test(p.position||'') && Math.max(s.stlPct||0,s.blkPct||0)>=2) return 'Two-Way Wing'; if((s.rpg||0)>=8) return 'High-Motor Forward'; return r==='guard'?'Combo Guard':r==='big'?'Modern Big':'Two-Way Prospect' }
export function getDraftRange(p) { if((p.rank||99)<=5) return 'Projected: Top 5'; if((p.rank||99)<=14) return 'Projected: Lottery'; if((p.rank||99)<=30) return 'Projected: First Round'; return 'Projected: Second Round' }
export function getPlayerComp(p) { const s=p.stats||{}, r=role(p.position), floor=r==='guard'?'Rotation Guard':r==='big'?'Rotation Big':'Rotation Wing'; if((s.threep||0)>=38) return ['Ceiling: premium spacer', 'Floor: '+floor]; if((s.ppg||0)>=20) return ['Ceiling: primary scorer', 'Floor: microwave scorer']; if((s.blkPct||0)>=3.5) return ['Ceiling: defensive anchor', 'Floor: rim protection specialist']; return ['Ceiling: '+(p.tier==='ELITE'?'franchise upside':'starter upside'), 'Floor: '+floor] }
export function getOverviewCopy(p) { const s=p.stats||{}, sub=(s.ts||0)>=60?'Produz volume com eficiência acima da curva.':(s.threep||0)>=37?'O arremesso cria um caminho claro de tradução.':Math.max(s.stlPct||0,s.blkPct||0)>=3?'Defesa e ferramentas fisicas puxam o valor inicial.':'Perfil que combina contexto, desenvolvimento e papel NBA.'; return { headline: profileHeadline(p), subheadline: getPlayerArchetype(p)+' / '+sub, body: p.scouting?.notes || 'Leitura baseada em producao, tier e indicadores disponiveis. O encaixe ideal depende de papel ofensivo claro e paciencia no desenvolvimento.' } }
export function getAttributeGrade(value) { if(value>=8.5) return 'Elite'; if(value>=7) return 'Plus'; if(value>=5.6) return 'Solid'; return 'Question' }
export function getAttributeCopy(attribute, p) { const s=p.stats||{}, k=String(attribute||'').toLowerCase(); if(k.includes('shoot')) return typeof s.threep==='number' ?num(s.threep)+'% de 3PT como termometro de spacing.' : 'Traducao ligada a volume e consistencia do jumper.'; if(k.includes('score')) return typeof s.ppg==='number' ?num(s.ppg)+' PPG mostram o peso ofensivo atual.' : 'Valor depende de criacao propria e vantagem fisica.'; if(k.includes('play')) return typeof s.apg==='number' ?num(s.apg)+' APG indicam leitura e criacao para terceiros.' : 'Precisa transformar leitura em vantagens consistentes.'; if(k.includes('defend')) return 'Atividade em roubos/tocos define o piso de impacto sem bola.'; if(k.includes('rebound')) return typeof s.rpg==='number' ?num(s.rpg)+' RPG contextualizam fisicalidade e motor.' : 'Rebote sera ponto chave para manter minutos.'; return 'Indicador qualitativo do pacote de ferramentas.' }
export function getDominantAttribute(attrs={}) { return RADAR.map(a=>[a, typeof attrs[a]==='number'?attrs[a]:5]).sort((a,b)=>b[1]-a[1])[0] || ['-',0] }
export function getWeakestAttribute(attrs={}) { return RADAR.map(a=>[a, typeof attrs[a]==='number'?attrs[a]:5]).sort((a,b)=>a[1]-b[1])[0] || ['-',0] }
export function getNBATranslation(p) { const s=p.stats||{}, r=role(p.position); const roleText=(s.ppg||0)>=18?'Scorer secundario':r==='big'?'Big de rotação':r==='wing'?'Wing de rotação':'Guard de segunda unidade'; const fit=(s.threep||0)>=36?'Melhor ao lado de um primary creator':(s.apg||0)>=4?'Ideal com finalizadores e spacing':r==='big'?'Precisa de espacamento ao redor':'Funciona melhor em ritmo alto e transição'; const risk=(s.threep||0)<32?'Consistência do arremesso':(s.astTo||2)<1.2?'Tomada de decisão contra pressoes fisicas':(s.ts||60)<54?'Eficiência contra atletas NBA':'Definir papel sem perder agressividade'; return [['Papel inicial',roleText],['Fit ideal',fit],['Principal risco',risk]] }
export function getStoryTags(p) { const s=p.stats||{}, tags=[]; if(p.tier==='ELITE') tags.push('Franchise Swing'); if((s.ppg||0)>=20) tags.push('Elite Scorer'); if((s.threep||0)>=37) tags.push('Shooting Swing'); if(Math.max(s.stlPct||0,s.blkPct||0)>=3) tags.push('Defensive Bet'); if((s.astTo||0)>=1.8 || (s.apg||0)>=4) tags.push('Playmaking Upside'); if((p.rank||99)>24) tags.push('Development Project'); if(!tags.length) tags.push('Safe Floor'); return tags.slice(0,5) }
export function getDecisionProfile(p, floorOverride, ceilingOverride) { const resolved=resolveOutcomeScores(p), manualRisk=manualEvaluation(p)?.risk?.level, floor=typeof floorOverride==='number'?floorOverride:resolved.floor, ceiling=typeof ceilingOverride==='number'?ceilingOverride:resolved.ceiling, risk=manualRisk || (floor<50?'High':floor<60?'Moderate':'Low'); return [{label:'Projecao',value:getCeilingLabel(ceiling),tone:'#a79be8'},{label:'Papel inicial',value:getFloorLabel(floor),tone:'#8bbfe8'},{label:'Risco',value:risk,tone:risk==='High'?'#e8a6a6':risk==='Moderate'||risk==='Medium'?'#8bbfe8':'#6fbf9c'},{label:'Nota geral',value:String(Math.round((floor+ceiling)/2)),tone:p.accentColor||'#a79be8'}] }
export function getPrimaryAttribute(p) { const b=badgesFor(p).map(([label,text])=>({label,text,value:attrValue(p,label)})).sort((a,b)=>b.value-a.value); return b[0] || {label:'Perfil',text:'Principal atributo em avaliação.',value:6} }
export function getDraftValue(p, currentPick) { const pick=currentPick || p.rank || 30, diff=(p.rank||pick)-pick; if(diff>=6) return ['Steal','#6fbf9c']; if(diff<=-6) return ['Reach','#e8a6a6']; return ['Fair Value','#8bbfe8'] }
export function getRadarCopy(attribute, type) { const k=String(attribute||'').toLowerCase(); if(type==='weak') { if(k.includes('shoot')) return 'A tradução depende de consistencia, volume e punicao a defesas mais fisicas.'; if(k.includes('rebound')) return 'Precisa evoluir no instinto, contato e posicionamento para fechar posses.'; if(k.includes('play')) return 'Ainda precisa acelerar leituras e reduzir decisões tardias contra pressoes.'; if(k.includes('defense')) return 'O ponto de atencao esta em sustentar impacto contra atletas NBA.'; return 'Area que pede desenvolvimento para estabilizar o papel NBA.' } if(k.includes('shoot')) return 'Espacamento, toque e confiança criam um caminho claro de impacto ofensivo.'; if(k.includes('play')) return 'Visao acima da media, leitura rapida e capacidade de criar vantagens.'; if(k.includes('defense')) return 'Ferramentas e atividade elevam o piso mesmo sem grande volume ofensivo.'; if(k.includes('rebound')) return 'Motor, fisico e presenca nos rebotes ajudam a sustentar minutos.'; return 'Ferramenta central que sustenta a avaliação geral do prospecto.' }

export function getFloorLabel(score) { if(score < 40) return 'G-League'; if(score < 50) return 'Fundo de banco'; if(score < 60) return 'Rotacao'; if(score < 70) return 'Starter'; if(score < 85) return 'All-Star'; if(score < 90) return 'Franchise Player'; return 'MVP' }
export function getCeilingLabel(score) { if(score < 40) return 'G-League'; if(score < 50) return 'Fundo de banco'; if(score < 60) return 'Rotacao'; if(score < 70) return 'Starter'; if(score < 85) return 'All-Star'; if(score < 90) return 'Franchise Player'; return 'MVP' }


export function strengthLabel(text='') { const t=text.toLowerCase(); if (t.includes('defens') || t.includes('aro') || t.includes('block') || t.includes('toco')) return 'Defender'; if (t.includes('rebote')) return 'Rebounder'; if (t.includes('passe') || t.includes('playmaking') || t.includes('leitura')) return 'Playmaker'; if (t.includes('arremesso') || t.includes('shoot') || t.includes('spacing') || t.includes('3')) return 'Shooter'; if (t.includes('motor') || t.includes('fisic') || t.includes('atlet')) return 'Motor'; return 'Ponto forte' }
export function addBadge(out, label, text) { if (!out.some(([l])=>l===label)) out.push([label,text]) }
export function badgesFor(p) { const s=p.stats||{}, sc=p.scouting||{}, r=role(p.position), reb=r==='big'?[10,7]:r==='forward'?[8,5.5]:r==='wing'?[6.5,4]:[5,3], ast=r==='guard'?[6,3]:r==='wing'?[4,2]:[3,1.5], three=r==='big'?[36,31]:r==='forward'?[37,33]:[38,34], out=[]; if(typeof s.threep==='number' && s.threep>=three[1]) addBadge(out,'Shooter', s.threep>=three[0] ?`Arremesso exterior forte: ${num(s.threep)}%.` : `Spacing funcional para a posicao: ${num(s.threep)}%.`); if(typeof s.ppg==='number' && s.ppg>=12) addBadge(out,'Scorer', s.ppg>=20 ?`Pontuador de alto volume: ${num(s.ppg)} PPG.` : `Pontuacao funcional dentro do papel: ${num(s.ppg)} PPG.`); if((typeof s.apg==='number' && s.apg>=ast[1]) || (typeof s.astTo==='number' && s.astTo>=1.8)) addBadge(out,'Playmaker', typeof s.apg==='number' ?`Cria vantagens para outros: ${num(s.apg)} APG.` : `Decide com seguranca: AST/TO ${num(s.astTo)}.`); if(typeof s.rpg==='number' && s.rpg>=reb[1]) addBadge(out,'Rebounder', s.rpg>=reb[0] ?`Impacto forte nos rebotes: ${num(s.rpg)} RPG.` : `Rebote solido para a função: ${num(s.rpg)} RPG.`); const def=Math.max(s.stlPct||0,s.blkPct||0); if(def>=1.5) addBadge(out,'Defender', def>=3 ?`Indicadores defensivos fortes: ${num(def)}%.` : `Atividade defensiva funcional: ${num(def)}%.`); if(typeof s.astTo==='number' && s.astTo>=1.2 && typeof s.ts==='number' && s.ts>=55) addBadge(out,'Connector',`Processa bem sem desperdic¸ar posses: AST/TO ${num(s.astTo)}.`); (sc.strengths||[]).forEach(item=>{ if(out.length<6) addBadge(out,strengthLabel(item),item) }); return out.slice(0,6) }
