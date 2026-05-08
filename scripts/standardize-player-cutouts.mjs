import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { PNG } from 'pngjs'

const root = process.cwd()
const sourceDir = path.join(root, 'src', 'assets', 'players', 'cutouts')
const outputDir = path.join(root, 'src', 'assets', 'players', 'cutouts-clean')
const outputWidth = 1080
const outputHeight = 1440

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

function isLikelyBackground(r, g, b, a) {
  if (a < 18) return true
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const avg = (r + g + b) / 3
  return avg > 185 && max - min < 30
}

function edgeBackgroundMask(image) {
  const { width, height, data } = image
  const total = width * height
  const mask = new Uint8Array(total)
  const queued = new Uint8Array(total)
  const queue = []

  function enqueue(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const index = y * width + x
    if (queued[index]) return
    const offset = index * 4
    if (!isLikelyBackground(data[offset], data[offset + 1], data[offset + 2], data[offset + 3])) return
    queued[index] = 1
    queue.push(index)
  }

  for (let x = 0; x < width; x += 1) enqueue(x, 0)
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y)
    enqueue(width - 1, y)
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor]
    mask[index] = 1
    const x = index % width
    const y = Math.floor(index / width)
    enqueue(x + 1, y)
    enqueue(x - 1, y)
    enqueue(x, y + 1)
    enqueue(x, y - 1)
  }

  return mask
}

function removeBakedBackground(image) {
  const mask = edgeBackgroundMask(image)
  const cleaned = new PNG({ width: image.width, height: image.height })
  image.data.copy(cleaned.data)

  for (let i = 0; i < mask.length; i += 1) {
    if (!mask[i]) continue
    const offset = i * 4
    cleaned.data[offset + 3] = 0
  }

  return cleaned
}

function findOpaqueBounds(image) {
  let left = image.width
  let top = image.height
  let right = -1
  let bottom = -1

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const alpha = image.data[(y * image.width + x) * 4 + 3]
      if (alpha < 18) continue
      left = Math.min(left, x)
      top = Math.min(top, y)
      right = Math.max(right, x)
      bottom = Math.max(bottom, y)
    }
  }

  if (right < left || bottom < top) {
    return { left: 0, top: 0, right: image.width - 1, bottom: image.height - 1 }
  }

  const padX = Math.round((right - left + 1) * 0.045)
  const padTop = Math.round((bottom - top + 1) * 0.035)
  const padBottom = Math.round((bottom - top + 1) * 0.012)

  return {
    left: clamp(left - padX, 0, image.width - 1),
    top: clamp(top - padTop, 0, image.height - 1),
    right: clamp(right + padX, 0, image.width - 1),
    bottom: clamp(bottom + padBottom, 0, image.height - 1),
  }
}

function sampleBilinear(image, x, y) {
  const x0 = clamp(Math.floor(x), 0, image.width - 1)
  const y0 = clamp(Math.floor(y), 0, image.height - 1)
  const x1 = clamp(x0 + 1, 0, image.width - 1)
  const y1 = clamp(y0 + 1, 0, image.height - 1)
  const dx = x - x0
  const dy = y - y0
  const out = [0, 0, 0, 0]

  for (let channel = 0; channel < 4; channel += 1) {
    const p00 = image.data[(y0 * image.width + x0) * 4 + channel]
    const p10 = image.data[(y0 * image.width + x1) * 4 + channel]
    const p01 = image.data[(y1 * image.width + x0) * 4 + channel]
    const p11 = image.data[(y1 * image.width + x1) * 4 + channel]
    const top = p00 * (1 - dx) + p10 * dx
    const bottom = p01 * (1 - dx) + p11 * dx
    out[channel] = Math.round(top * (1 - dy) + bottom * dy)
  }

  return out
}

function standardizeCanvas(image) {
  const bounds = findOpaqueBounds(image)
  const sourceWidth = bounds.right - bounds.left + 1
  const sourceHeight = bounds.bottom - bounds.top + 1
  const maxWidth = outputWidth * 0.9
  const maxHeight = outputHeight * 0.91
  const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight)
  const drawWidth = Math.round(sourceWidth * scale)
  const drawHeight = Math.round(sourceHeight * scale)
  const drawX = Math.round((outputWidth - drawWidth) / 2)
  const drawY = Math.round(outputHeight - drawHeight - outputHeight * 0.035)
  const output = new PNG({ width: outputWidth, height: outputHeight })

  output.data.fill(0)

  for (let y = 0; y < drawHeight; y += 1) {
    for (let x = 0; x < drawWidth; x += 1) {
      const sourceX = bounds.left + x / scale
      const sourceY = bounds.top + y / scale
      const [r, g, b, a] = sampleBilinear(image, sourceX, sourceY)
      const offset = ((drawY + y) * outputWidth + drawX + x) * 4
      output.data[offset] = r
      output.data[offset + 1] = g
      output.data[offset + 2] = b
      output.data[offset + 3] = a < 8 ? 0 : a
    }
  }

  return output
}

await mkdir(outputDir, { recursive: true })

const files = (await readdir(sourceDir)).filter(file => file.toLowerCase().endsWith('.png')).sort()
const report = []

for (const file of files) {
  const sourcePath = path.join(sourceDir, file)
  const image = PNG.sync.read(await readFile(sourcePath))
  const hadAlpha = image.colorType === 4 || image.colorType === 6
  const cleaned = removeBakedBackground(image)
  const standardized = standardizeCanvas(cleaned)
  const outputPath = path.join(outputDir, file)
  await writeFile(outputPath, PNG.sync.write(standardized, { colorType: 6 }))
  report.push({ file, hadAlpha, width: image.width, height: image.height })
}

console.log(JSON.stringify({ outputDir, processed: report.length, withoutAlpha: report.filter(item => !item.hadAlpha).length }, null, 2))
