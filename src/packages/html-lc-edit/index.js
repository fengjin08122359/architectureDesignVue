'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/html-lc-edit.cjs.prod.js.js.js')
} else {
  module.exports = require('./dist/html-lc-edit.cjs.js.js.js')
}
