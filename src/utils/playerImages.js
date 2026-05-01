const playerImageModules = import.meta.glob('../assets/players/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

const optimizedImageModules = import.meta.glob('../assets/players/optimized/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

const cutoutImageModules = import.meta.glob('../assets/players/cutouts/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

const manualAliases = {
  'cameron-boozer': 'cam-boozer',
  'cameron-carr': 'cam-carr',
  'mikel-brown-jr': 'mikel-brown',
  'darius-acuff-jr': 'darius-acuff',
  'yaxel-lendeborg': 'yaxel-lendenborg',
}

function buildImageMap(modules) {
  return Object.entries(modules).reduce((acc, [filePath, src]) => {
    const fileName = filePath.split('/').pop() || ''
    const slug = fileName.replace(/.(png|jpe?g|webp)$/i, '')
    acc[slug] = src
    return acc
  }, {})
}

const imageBySlug = {
  ...buildImageMap(optimizedImageModules),
  ...buildImageMap(playerImageModules),
}

const cutoutBySlug = buildImageMap(cutoutImageModules)

export function slugifyPlayerName(name = '') {
  return String(name)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/(jr|sr|ii|iii|iv).?/gi, '')
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
  return cutoutBySlug[slug] || imageBySlug[slug] || null
}
