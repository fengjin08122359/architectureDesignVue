'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/lc-logic.cjs.prod.js')
} else {
  module.exports = require('./dist/lc-logic.cjs.js')
}
