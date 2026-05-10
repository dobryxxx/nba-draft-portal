const optimizedImageModules = import.meta.glob('../assets/players/optimized/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

const cleanCutoutImageModules = import.meta.glob('../assets/players/cutouts-clean/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

const manualAliases = {
  'cameron-boozer': 'cam-boozer',
  'cameron-carr': 'cam-carr',
  'mikel-brown-jr': 'mikel-brown',
  'mikel-brown': 'mikel-brown',
  'darius-acuff-jr': 'darius-acuff',
  'darius-acuff': 'darius-acuff',
  'yaxel-lendeborg': 'yaxel-lendenborg',
  'ebuka-okorie': 'obuka-okorie',
  'matthew-able': 'matt-able',
  'sergio-de-larrea': 'sergio-delarrea',
  'alexandros-samodurov': 'samodurov',
}

function buildImageMap(modules) {
  return Object.entries(modules).reduce((acc, [filePath, src]) => {
    const fileName = filePath.split('/').pop() || ''
    const slug = fileName.replace(/\.(png|jpe?g|webp)$/i, '')
    acc[slug] = src
    return acc
  }, {})
}

const imageBySlug = buildImageMap(optimizedImageModules)
const cleanCutoutBySlug = buildImageMap(cleanCutoutImageModules)
const publicCutoutSlugs = new Set([
  'aday-mara',
  'aj-dybantsa',
  'allen-graves',
  'amari-allen',
  'andrej-stojakovic',
  'bennett-stirtz',
  'billy-richmond',
  'brayden-burries',
  'caleb-wilson',
  'cam-boozer',
  'cam-carr',
  'chris-cenac',
  'christian-anderson',
  'dailyn-swain',
  'darius-acuff',
  'darryn-peterson',
  'elliot-cadeau',
  'flory-bidunga',
  'hannes-steinbach',
  'henri-veesaar',
  'isaiah-evans',
  'isiah-harwell',
  'jayden-quaintance',
  'jeremy-fears',
  'joshua-jefferson',
  'juke-harris',
  'karim-lopez',
  'keaton-wagler',
  'kingston-flemings',
  'koa-peat',
  'labaron-philon',
  'luigi-suigo',
  'malachi-moreno',
  'matt-able',
  'meleek-thomas',
  'mikel-brown',
  'milan-momcilovic',
  'morez-johnson',
  'nate-ament',
  'obuka-okorie',
  'samodurov',
  'sergio-delarrea',
  'tounde-yessoufou',
  'tyler-tanner',
  'yaxel-lendenborg',
])

export function slugifyPlayerName(name = '') {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(jr|sr|ii|iii|iv)\.?\b/gi, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function resolveSlug(prospectOrName) {
  const name = typeof prospectOrName === 'string' ? prospectOrName : prospectOrName?.name
  const slug = slugifyPlayerName(name)
  return manualAliases[slug] || slug
}

export function getPlayerImage(prospectOrName) {
  const slug = resolveSlug(prospectOrName)
  return publicCutoutSlugs.has(slug) ? `/player-cutouts/${slug}.png` : imageBySlug[slug] || null
}

export function getPlayerCutoutImage(prospectOrName) {
  const slug = resolveSlug(prospectOrName)
  return publicCutoutSlugs.has(slug) ? `/player-cutouts/${slug}.png` : cleanCutoutBySlug[slug] || imageBySlug[slug] || null
}
