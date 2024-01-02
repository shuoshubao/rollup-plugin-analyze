const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { deflateRaw } = require('pako')
const { pick, chunk } = require('lodash')
const { name } = require('./package')

const deflateData = data => {
  return deflateRaw(JSON.stringify(data || {}).toString())
}

const getFileContent = fileName => {
  return readFileSync(resolve(__dirname, fileName)).toString()
}

const unpkgPrefix = `https://unpkg.com/${name}@latest`

module.exports = (options = {}) => {
  const { filename = 'stats.html' } = options
  return {
    name,
    generateBundle(outputOptions, outputBundle) {
      const data = {}

      Object.entries(outputBundle).forEach(([k, v]) => {
        if (!k.endsWith('.js')) {
          return
        }
        const { modules } = v
        data[k] = {
          modules: Object.entries(modules).reduce((prev, [k2, v2]) => {
            prev[k2.replace(/\0/g, '').replace(process.cwd() + '/', '')] = pick(v2, 'originalLength', 'renderedLength')
            return prev
          }, {})
        }
      })

      const arrText = chunk(String(deflateData(data)).split(','), 100)
        .map(v => {
          return v.join(', ')
        })
        .join(',\n')

      const html = getFileContent('index.html')
        .replace('dist/index.css', `${unpkgPrefix}/dist/index.css`)
        .replace('dist/index.js', `${unpkgPrefix}/dist/index.js`)
        .replace('<script src="docs/StatsData.js">', `<script>\nwindow.StatsData = [${arrText}]\n`)

      writeFileSync(filename, html)

      return outputBundle
    }
  }
}
