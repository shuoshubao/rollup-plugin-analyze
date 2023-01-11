const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { deflateRaw } = require('pako')
const { name, version } = require('./package')

const deflateData = data => {
  return deflateRaw(JSON.stringify(data || {}).toString())
}

const pick = (obj, ...props) => {
  return props.reduce((result, prop) => {
    result[prop] = obj[prop]
    return result
  }, {})
}

const getFileContent = fileName => {
  return readFileSync(resolve(__dirname, fileName)).toString()
}

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

      const html = getFileContent('index.html')
        .replace('dist/index.js', `https://unpkg.com/${name}@${version}/dist/index.js`)
        .replace('<script src="docs/StatsData.js">', `<script>window.StatsData = '${deflateData(data)}'`)

      writeFileSync(filename, html)

      return outputBundle
    }
  }
}
