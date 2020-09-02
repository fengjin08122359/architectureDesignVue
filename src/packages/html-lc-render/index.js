'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/html-lc-render.cjs.prod.js.js')
} else {
  module.exports = require('./dist/html-lc-render.cjs.js.js')
}
