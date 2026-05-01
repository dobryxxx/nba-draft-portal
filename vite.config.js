import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { transformAsync } from '@babel/core'
import jsx from '@babel/plugin-transform-react-jsx'

// Troque 'nba-draft-portal' pelo nome exato do seu repositório no GitHub
function babelJsxTransform() {
  return {
    name: 'local:babel-jsx-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\.[jt]sx$/.test(id)) return null
      const result = await transformAsync(code, {
        filename: id,
        sourceMaps: true,
        plugins: [[jsx, { runtime: 'automatic', importSource: 'react' }]],
        babelrc: false,
        configFile: false,
      })
      return { code: result.code, map: result.map }
    },
  }
}

export default defineConfig({
  plugins: [babelJsxTransform(), react()],
  esbuild: { exclude: /\.(m?ts|[jt]sx)$/ },
  base: '/nba-draft-portal/',
  build: {
    target: 'esnext',
    minify: false,
    cssMinify: false,
  },
  optimizeDeps: {
    noDiscovery: true,
    include: [],
  },
})
