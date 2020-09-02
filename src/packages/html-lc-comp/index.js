'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/html-lc-comp.cjs.prod.js.js')
} else {
  module.exports = require('./dist/html-lc-comp.cjs.js.js')
}
