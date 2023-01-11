# rollup-plugin-analyze

A visualizer rollup analyzer

# Examples

- https://shuoshubao.github.io/rollup-plugin-analyze
- https://shuoshubao.github.io/stats.html

# Install

```sh
npm i D rollup-plugin-analyze
```

# Usage

## rollup.config.js

```js
const Analyze = require('rollup-plugin-analyze')

module.exports = {
  input: 'lib/index.jsx',
  output: {
    file: 'dist/index.js',
    format: 'iife'
  },
  plugins: [Analyze()]
}
```

## vite.config.js

```js
import react from '@vitejs/plugin-react'
import Analyze from 'rollup-plugin-analyze'

export default () => {
  return {
    plugins: [react(), Analyze()]
  }
}
```
