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
  return imageBySlug[slug] || null
}

export function getPlayerCutoutImage(prospectOrName) {
  const slug = resolveSlug(prospectOrName)
  return cleanCutoutBySlug[slug] || imageBySlug[slug] || null
}
