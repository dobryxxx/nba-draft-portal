import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { PNG } from 'pngjs'

const root = process.cwd()
const sourceDir = path.join(root, 'src', 'assets', 'players', 'cutouts-clean')
const outputDir = path.join(root, 'src', 'assets', 'players', 'cutouts-polished')
const alphaCutoff = 18

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

function offsetOf(image, x, y) {
  return (y * image.width + x) * 4
}

function pixelInfo(image, x, y) {
  const offset = offsetOf(image, x, y)
  const r = image.data[offset]
  const g = image.data[offset + 1]
  const b = image.data[offset + 2]
  const a = image.data[offset + 3]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const avg = (r + g + b) / 3
  return { r, g, b, a, max, min, avg, sat: max - min }
}

function exteriorTransparentMask(image) {
  const total = image.width * image.height
  const exterior = new Uint8Array(total)
  const queued = new Uint8Array(total)
  const queue = []

  function enqueue(x, y) {
    if (x < 0 || y < 0 || x >= image.width || y >= image.height) return
    const index = y * image.width + x
    if (queued[index]) return
    const alpha = image.data[index * 4 + 3]
    if (alpha >= alphaCutoff) return
    queued[index] = 1
    queue.push(index)
  }

  for (let x = 0; x < image.width; x += 1) {
    enqueue(x, 0)
    enqueue(x, image.height - 1)
  }
  for (let y = 0; y < image.height; y += 1) {
    enqueue(0, y)
    enqueue(image.width - 1, y)
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor]
    exterior[index] = 1
    const x = index % image.width
    const y = Math.floor(index / image.width)
    enqueue(x + 1, y)
    enqueue(x - 1, y)
    enqueue(x, y + 1)
    enqueue(x, y - 1)
  }

  return exterior
}

function nearestVisibleColor(image, x, y, radius = 14) {
  let best = null
  let bestDistance = Infinity

  for (let ry = -radius; ry <= radius; ry += 1) {
    for (let rx = -radius; rx <= radius; rx += 1) {
      const sx = x + rx
      const sy = y + ry
      if (sx < 0 || sy < 0 || sx >= image.width || sy >= image.height) continue
      const distance = rx * rx + ry * ry
      if (distance === 0 || distance > bestDistance) continue
      const p = pixelInfo(image, sx, sy)
      if (p.a < 90) continue
      best = p
      bestDistance = distance
    }
  }

  return best
}

function nearestNonHaloColor(image, x, y, radius = 5) {
  let r = 0
  let g = 0
  let b = 0
  let count = 0

  for (let ry = -radius; ry <= radius; ry += 1) {
    for (let rx = -radius; rx <= radius; rx += 1) {
      const sx = x + rx
      const sy = y + ry
      if (sx < 0 || sy < 0 || sx >= image.width || sy >= image.height) continue
      const p = pixelInfo(image, sx, sy)
      if (p.a < 150) continue
      if (p.avg > 190 && p.sat < 50) continue
      r += p.r
      g += p.g
      b += p.b
      count += 1
    }
  }

  if (!count) return null
  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
  }
}

function hasTransparentNeighbor(image, x, y) {
  for (let ry = -1; ry <= 1; ry += 1) {
    for (let rx = -1; rx <= 1; rx += 1) {
      if (!rx && !ry) continue
      const sx = x + rx
      const sy = y + ry
      if (sx < 0 || sy < 0 || sx >= image.width || sy >= image.height) return true
      if (image.data[offsetOf(image, sx, sy) + 3] < 80) return true
    }
  }
  return false
}

function fillInteriorAlphaHoles(image, exterior) {
  let filled = 0

  for (let y = 1; y < image.height - 1; y += 1) {
    for (let x = 1; x < image.width - 1; x += 1) {
      const index = y * image.width + x
      const offset = index * 4
      if (exterior[index] || image.data[offset + 3] >= alphaCutoff) continue

      const fill = nearestVisibleColor(image, x, y)
      if (!fill) continue

      image.data[offset] = fill.r
      image.data[offset + 1] = fill.g
      image.data[offset + 2] = fill.b
      image.data[offset + 3] = clamp(Math.round(fill.a * 0.94), 120, 255)
      filled += 1
    }
  }

  return filled
}

function removeLightHairFringe(image) {
  const original = Buffer.from(image.data)
  let adjusted = 0

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const offset = offsetOf(image, x, y)
      const r = original[offset]
      const g = original[offset + 1]
      const b = original[offset + 2]
      const a = original[offset + 3]
      if (a < 35 || !hasTransparentNeighbor(image, x, y)) continue

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const avg = (r + g + b) / 3
      const isUpperSubject = y < image.height * 0.56
      const isWhiteHalo = avg > 182 && max - min < 58
      if (!isUpperSubject || !isWhiteHalo) continue

      const replacement = nearestNonHaloColor(image, x, y)
      if (replacement) {
        image.data[offset] = Math.round(r * 0.18 + replacement.r * 0.82)
        image.data[offset + 1] = Math.round(g * 0.18 + replacement.g * 0.82)
        image.data[offset + 2] = Math.round(b * 0.18 + replacement.b * 0.82)
      } else {
        image.data[offset] = Math.round(r * 0.58)
        image.data[offset + 1] = Math.round(g * 0.58)
        image.data[offset + 2] = Math.round(b * 0.58)
      }
      image.data[offset + 3] = clamp(Math.round(a * 0.92), 0, 255)
      adjusted += 1
    }
  }

  return adjusted
}

function softenOuterMatte(image, exterior) {
  let softened = 0

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const index = y * image.width + x
      if (exterior[index]) continue
      const offset = index * 4
      const alpha = image.data[offset + 3]
      if (alpha < 40 || alpha > 230 || !hasTransparentNeighbor(image, x, y)) continue
      image.data[offset + 3] = clamp(Math.round(alpha * 0.88), 0, 255)
      softened += 1
    }
  }

  return softened
}

await mkdir(outputDir, { recursive: true })

const files = (await readdir(sourceDir)).filter(file => file.toLowerCase().endsWith('.png')).sort()
const report = []

for (const file of files) {
  const sourcePath = path.join(sourceDir, file)
  const image = PNG.sync.read(await readFile(sourcePath))
  const exterior = exteriorTransparentMask(image)
  const holesFilled = fillInteriorAlphaHoles(image, exterior)
  const fringeAdjusted = removeLightHairFringe(image)
  const edgeSoftened = softenOuterMatte(image, exterior)
  const outputPath = path.join(outputDir, file)
  await writeFile(outputPath, PNG.sync.write(image, { colorType: 6 }))
  report.push({ file, holesFilled, fringeAdjusted, edgeSoftened })
}

const totals = report.reduce(
  (acc, item) => ({
    holesFilled: acc.holesFilled + item.holesFilled,
    fringeAdjusted: acc.fringeAdjusted + item.fringeAdjusted,
    edgeSoftened: acc.edgeSoftened + item.edgeSoftened,
  }),
  { holesFilled: 0, fringeAdjusted: 0, edgeSoftened: 0 }
)

console.log(JSON.stringify({ outputDir, processed: report.length, totals }, null, 2))
