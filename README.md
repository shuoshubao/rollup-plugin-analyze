# rollup-plugin-analyze

A visualizer rollup analyzer

# Examples

- https://shuoshubao.github.io/rollup-plugin-analyze

# Install

```sh
npm i D rollup-plugin-analyze
```

# Usage

## rollup.config.js

```js
const Analysis = require('rollup-plugin-analyze')

module.exports = {
  input: 'lib/index.jsx',
  output: {
    file: 'dist/index.js',
    format: 'iife'
  },
  plugins: [Analysis()]
}
```
